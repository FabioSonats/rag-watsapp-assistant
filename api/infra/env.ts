import 'dotenv/config';

import { configurationSettingsSchema } from '@rag-whatsapp-assistant/shared';
import { z } from 'zod';

const envSchema = configurationSettingsSchema.extend({
  firebaseProjectId: z.string().min(1, 'Firebase project ID is required'),
  firebaseClientEmail: z.string().email('Firebase client email must be valid'),
  firebasePrivateKey: z.string().min(1, 'Firebase private key is required'),
  firebaseStorageBucket: z.string().min(1).optional(),
  whatsappWebhookSecret: z.string().optional(),
  whatsappDefaultPhoneNumberId: z.string().optional(),
});

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

const parsed = envSchema.safeParse({
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  defaultModel: {
    provider: (process.env.OPENROUTER_DEFAULT_PROVIDER ?? 'gpt-4') as never,
    model: process.env.OPENROUTER_DEFAULT_MODEL ?? 'gpt-4.1-mini',
  },
  systemPrompt:
    process.env.SYSTEM_PROMPT ??
    'Você é um assistente de IA que responde com base nas últimas instruções configuradas.',
  evolutionApiUrl: process.env.EVOLUTION_API_URL ?? 'https://evodevs.cordex.ai',
  evolutionApiKey: process.env.EVOLUTION_API_KEY,
  firebaseProjectId,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey,
  firebaseStorageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ??
    (firebaseProjectId ? `${firebaseProjectId}.appspot.com` : undefined),
  whatsappWebhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET,
  whatsappDefaultPhoneNumberId: process.env.WHATSAPP_DEFAULT_PHONE_NUMBER_ID,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  ...parsed.data,
  firebaseStorageBucket:
    parsed.data.firebaseStorageBucket ?? `${parsed.data.firebaseProjectId}.appspot.com`,
};

