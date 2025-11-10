import {
  configurationSettingsSchema,
  configurationSettingsPublicSchema,
  hasSecretValue,
  redactSecretValue,
  sanitizeConfiguration,
  sanitizeConfigurationUpdate,
  type ConfigurationSettings,
  type ConfigurationSettingsPublic,
  type ConfigurationSettingsUpdate,
} from '@rag-whatsapp-assistant/shared';
import { FieldValue } from 'firebase-admin/firestore';

import { AppError } from '../domain/errors/AppError';
import { firestore } from '../infra/firebaseAdmin';
import { env } from '../infra/env';

const SETTINGS_COLLECTION = 'settings';
const PLATFORM_DOCUMENT_ID = 'platform';
const CACHE_TTL_MS = 60_000;

type StoredSettings = ConfigurationSettings;

interface CachedSettings {
  settings: StoredSettings;
  metadata: SettingsMetadata;
  expiresAt: number;
}

interface SettingsMetadata {
  updatedAt: string | null;
  source: 'firestore' | 'env';
}

const settingsDocRef = firestore.collection(SETTINGS_COLLECTION).doc(PLATFORM_DOCUMENT_ID);

let cache: CachedSettings | null = null;

const buildPublicView = (
  settings: StoredSettings,
  metadata: SettingsMetadata,
): ConfigurationSettingsPublic => {
  const payload = {
    openRouter: {
      defaultModel: settings.openRouter.defaultModel,
      apiKeyConfigured: hasSecretValue(settings.openRouter.apiKey),
      apiKeyPreview: redactSecretValue(settings.openRouter.apiKey),
    },
    evolution: {
      apiUrl: settings.evolution.apiUrl,
      apiKeyConfigured: hasSecretValue(settings.evolution.apiKey),
      apiKeyPreview: redactSecretValue(settings.evolution.apiKey),
      ...(settings.evolution.defaultPhoneNumberId
        ? { defaultPhoneNumberId: settings.evolution.defaultPhoneNumberId }
        : {}),
    },
    prompts: {
      system: settings.prompts.system,
    },
    metadata,
  };

  return configurationSettingsPublicSchema.parse(payload);
};

const mergeSettings = (
  current: StoredSettings,
  update: ConfigurationSettingsUpdate,
): StoredSettings => {
  const next: StoredSettings = {
    openRouter: { ...current.openRouter },
    evolution: { ...current.evolution },
    prompts: { ...current.prompts },
  };

  if (update.openRouter?.defaultModel) {
    next.openRouter.defaultModel = update.openRouter.defaultModel;
  }

  if (update.openRouter?.apiKey) {
    next.openRouter.apiKey = update.openRouter.apiKey;
  }

  if (update.evolution?.apiUrl) {
    next.evolution.apiUrl = update.evolution.apiUrl;
  }

  if (update.evolution?.apiKey) {
    next.evolution.apiKey = update.evolution.apiKey;
  }

  if (update.evolution?.defaultPhoneNumberId !== undefined) {
    const value = update.evolution.defaultPhoneNumberId;
    next.evolution.defaultPhoneNumberId = value === null ? undefined : value ?? undefined;
  }

  if (update.prompts?.system) {
    next.prompts.system = update.prompts.system;
  }

  return sanitizeConfiguration(next);
};

const fetchSettingsFromStore = async (): Promise<{
  settings: StoredSettings;
  metadata: SettingsMetadata;
}> => {
  const snapshot = await settingsDocRef.get();

  if (!snapshot.exists) {
    return {
      settings: env.settings,
      metadata: { updatedAt: null, source: 'env' },
    };
  }

  const parsed = configurationSettingsSchema.safeParse(snapshot.data());
  if (!parsed.success) {
    throw new AppError('Stored settings are invalid', 500, {
      issues: parsed.error.flatten(),
    });
  }

  return {
    settings: parsed.data,
    metadata: {
      updatedAt: snapshot.updateTime?.toDate().toISOString() ?? null,
      source: 'firestore',
    },
  };
};

const getCachedSettings = async (): Promise<{ settings: StoredSettings; metadata: SettingsMetadata }> => {
  if (cache && cache.expiresAt > Date.now()) {
    return { settings: cache.settings, metadata: cache.metadata };
  }

  const result = await fetchSettingsFromStore();
  cache = {
    settings: result.settings,
    metadata: result.metadata,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return result;
};

export const settingsService = {
  async get(): Promise<ConfigurationSettingsPublic> {
    const { settings, metadata } = await getCachedSettings();
    return buildPublicView(settings, metadata);
  },

  async getCurrentSettings(): Promise<StoredSettings> {
    const { settings } = await getCachedSettings();
    return settings;
  },

  async refresh(): Promise<void> {
    const result = await fetchSettingsFromStore();
    cache = {
      settings: result.settings,
      metadata: result.metadata,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
  },

  async update(input: unknown): Promise<ConfigurationSettingsPublic> {
    const payload = sanitizeConfigurationUpdate(input);

    if (!payload.openRouter && !payload.evolution && !payload.prompts) {
      throw new AppError('Nenhuma alteração informada', 400);
    }

    const { settings: current } = await getCachedSettings();
    const next = mergeSettings(current, payload);

    const documentPayload: Record<string, unknown> = {
      openRouter: {
        apiKey: next.openRouter.apiKey,
        defaultModel: next.openRouter.defaultModel,
      },
      evolution: {
        apiUrl: next.evolution.apiUrl,
        apiKey: next.evolution.apiKey,
        ...(next.evolution.defaultPhoneNumberId
          ? { defaultPhoneNumberId: next.evolution.defaultPhoneNumberId }
          : {}),
      },
      prompts: next.prompts,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await settingsDocRef.set(documentPayload, { merge: false });

    const metadata: SettingsMetadata = {
      updatedAt: new Date().toISOString(),
      source: 'firestore',
    };

    cache = {
      settings: next,
      metadata,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return buildPublicView(next, metadata);
  },
};


