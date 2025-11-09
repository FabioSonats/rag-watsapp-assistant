import {
  createDefaultSettingsDocument,
  settingsDocumentSchema,
  settingsUpdateSchema,
  type SettingsSnapshot,
  type SettingsUpdateInput,
} from '@rag-whatsapp-assistant/shared';
import type { Timestamp } from 'firebase-admin/firestore';

import { firestore } from '../infra/firebaseAdmin';
const normalizeTimestamp = (value: unknown) => {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const timestamp = value as Timestamp | undefined;

  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }

  return new Date().toISOString();
};


const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOCUMENT_ID = 'platform';

const settingsDocRef = firestore.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOCUMENT_ID);

const maskSecret = (value?: string | null) => {
  if (!value) {
    return { hasValue: false, preview: null };
  }

  const visible = value.slice(0, 4);
  return {
    hasValue: true,
    preview: `${visible}••••`,
  };
};

const toSnapshot = (data: unknown): SettingsSnapshot => {
  const parsed = settingsDocumentSchema.parse(data ?? {});
  const defaults = createDefaultSettingsDocument();

  return {
    configuration: {
      defaultModel: parsed.defaultModel ?? defaults.defaultModel,
      systemPrompt: parsed.systemPrompt ?? defaults.systemPrompt,
      evolutionApiUrl: parsed.evolutionApiUrl ?? defaults.evolutionApiUrl,
    },
    secrets: {
      openRouterApiKey: maskSecret(parsed.openRouterApiKey),
      evolutionApiKey: maskSecret(parsed.evolutionApiKey),
    },
    timestamps: {
      createdAt: normalizeTimestamp(parsed.createdAt),
      updatedAt: normalizeTimestamp(parsed.updatedAt),
    },
  };
};

export const settingsService = {
  async get(): Promise<SettingsSnapshot> {
    const snapshot = await settingsDocRef.get();

    if (!snapshot.exists) {
      const defaults = createDefaultSettingsDocument();
      await settingsDocRef.set(defaults, { merge: true });
      return toSnapshot(defaults);
    }

    return toSnapshot(snapshot.data());
  },

  async update(input: SettingsUpdateInput): Promise<SettingsSnapshot> {
    const sanitized = settingsUpdateSchema.parse(input);
    const now = new Date().toISOString();

    const payload: Record<string, unknown> = {
      updatedAt: now,
    };

    if (sanitized.defaultModel) {
      payload.defaultModel = sanitized.defaultModel;
    }

    if (typeof sanitized.systemPrompt === 'string') {
      payload.systemPrompt = sanitized.systemPrompt;
    }

    if (typeof sanitized.evolutionApiUrl === 'string') {
      payload.evolutionApiUrl = sanitized.evolutionApiUrl;
    }

    if (typeof sanitized.openRouterApiKey === 'string') {
      payload.openRouterApiKey = sanitized.openRouterApiKey;
    }

    if (typeof sanitized.evolutionApiKey === 'string') {
      payload.evolutionApiKey = sanitized.evolutionApiKey;
    }

    const snapshot = await settingsDocRef.get();

    if (!snapshot.exists) {
      await settingsDocRef.set({
        ...createDefaultSettingsDocument(),
        ...payload,
      });
    } else {
      await settingsDocRef.set(payload, { merge: true });
    }

    const updated = await settingsDocRef.get();
    return toSnapshot(updated.data());
  },
};

