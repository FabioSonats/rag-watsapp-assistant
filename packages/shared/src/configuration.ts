import { z } from 'zod';

export const modelProviders = ['gpt-4', 'claude', 'llama', 'gemini'] as const;

export const aiModelConfigSchema = z.object({
  provider: z.enum(modelProviders),
  model: z.string().min(1, 'Model name is required'),
});

const secretSchema = z
  .string({ required_error: 'Secret value is required' })
  .min(1, 'Secret value must not be empty');

export const openRouterSettingsSchema = z.object({
  apiKey: secretSchema,
  defaultModel: aiModelConfigSchema,
});

export const evolutionSettingsSchema = z.object({
  apiUrl: z.string().url('Evolution API URL must be valid'),
  apiKey: secretSchema,
  defaultPhoneNumberId: z.string().min(1).optional(),
});

export const promptsSettingsSchema = z.object({
  system: z.string().min(1, 'System prompt must not be empty'),
});

export const configurationSettingsSchema = z.object({
  openRouter: openRouterSettingsSchema,
  evolution: evolutionSettingsSchema,
  prompts: promptsSettingsSchema,
});

export const configurationSettingsPublicSchema = z.object({
  openRouter: z.object({
    defaultModel: aiModelConfigSchema,
    apiKeyConfigured: z.boolean(),
    apiKeyPreview: z.string().nullable(),
  }),
  evolution: z.object({
    apiUrl: evolutionSettingsSchema.shape.apiUrl,
    apiKeyConfigured: z.boolean(),
    apiKeyPreview: z.string().nullable(),
    defaultPhoneNumberId: z.string().min(1).optional(),
  }),
  prompts: promptsSettingsSchema.pick({ system: true }),
  metadata: z.object({
    updatedAt: z.string().nullable(),
    source: z.enum(['firestore', 'env']),
  }),
});

export const configurationSettingsUpdateSchema = z.object({
  openRouter: z
    .object({
      apiKey: secretSchema.optional(),
      defaultModel: aiModelConfigSchema.optional(),
    })
    .partial()
    .optional(),
  evolution: z
    .object({
      apiUrl: z.string().url('Evolution API URL must be valid').optional(),
      apiKey: secretSchema.optional(),
      defaultPhoneNumberId: z.string().min(1).nullable().optional(),
    })
    .partial()
    .optional(),
  prompts: z
    .object({
      system: z.string().min(1, 'System prompt must not be empty').optional(),
    })
    .partial()
    .optional(),
});

export type ConfigurationSettings = z.infer<typeof configurationSettingsSchema>;
export type ConfigurationSettingsUpdate = z.infer<typeof configurationSettingsUpdateSchema>;
export type ConfigurationSettingsPublic = z.infer<typeof configurationSettingsPublicSchema>;

export const sanitizeConfiguration = (input: unknown): ConfigurationSettings =>
  configurationSettingsSchema.parse(input);

export const sanitizeConfigurationUpdate = (input: unknown): ConfigurationSettingsUpdate =>
  configurationSettingsUpdateSchema.parse(input);

export const hasSecretValue = (value: string | null | undefined): boolean =>
  Boolean(value && value.trim().length > 0);

export const redactSecretValue = (value: string | null | undefined): string | null => {
  if (!hasSecretValue(value)) {
    return null;
  }

  const normalized = value!.trim();
  if (normalized.length <= 6) {
    return `${normalized.slice(0, 2)}•••`;
  }

  return `${normalized.slice(0, 4)}••••${normalized.slice(-2)}`;
};
