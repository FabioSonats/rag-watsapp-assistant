import 'dotenv/config';

import {
  configurationSettingsSchema,
  type ConfigurationSettings,
  type ConfigurationSettingsUpdate,
} from '@rag-whatsapp-assistant/shared';
import { z } from 'zod';

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

const settingsResult = configurationSettingsSchema.safeParse({
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultModel: {
      provider: (process.env.OPENROUTER_DEFAULT_PROVIDER ?? 'gpt-4') as ConfigurationSettings['openRouter']['defaultModel']['provider'],
      model: process.env.OPENROUTER_DEFAULT_MODEL ?? 'gpt-4.1-mini',
    },
  },
  evolution: {
    apiUrl: process.env.EVOLUTION_API_URL ?? 'https://evodevs.cordex.ai',
    apiKey: process.env.EVOLUTION_API_KEY,
    defaultPhoneNumberId: process.env.WHATSAPP_DEFAULT_PHONE_NUMBER_ID,
  },
  prompts: {
    system:
      process.env.SYSTEM_PROMPT ??
      'Você é um assistente de IA que responde com base nas últimas instruções configuradas.',
  },
});

if (!settingsResult.success) {
  throw new Error(`Invalid base configuration: ${settingsResult.error.message}`);
}

const envSchema = z.object({
  firebaseProjectId: z.string().min(1, 'Firebase project ID is required'),
  firebaseClientEmail: z.string().email('Firebase client email must be valid'),
  firebasePrivateKey: z.string().min(1, 'Firebase private key is required'),
  firebaseStorageBucket: z.string().min(1).optional(),
  whatsappWebhookSecret: z.string().optional(),
});

const parsed = envSchema.safeParse({
  firebaseProjectId,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey,
  firebaseStorageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ??
    (firebaseProjectId ? `${firebaseProjectId}.appspot.com` : undefined),
  whatsappWebhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const settings = settingsResult.data;

export const env = {
  ...parsed.data,
  settings,
  openRouterApiKey: settings.openRouter.apiKey,
  defaultModel: settings.openRouter.defaultModel,
  systemPrompt: settings.prompts.system,
  evolutionApiUrl: settings.evolution.apiUrl,
  evolutionApiKey: settings.evolution.apiKey,
  whatsappDefaultPhoneNumberId: settings.evolution.defaultPhoneNumberId,
  firebaseStorageBucket:
    parsed.data.firebaseStorageBucket ?? `${parsed.data.firebaseProjectId}.appspot.com`,
};

export type EnvSettings = ConfigurationSettings;
export type EnvSettingsUpdate = ConfigurationSettingsUpdate;
