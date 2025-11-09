import { z } from 'zod';

export const modelProviders = ['gpt-4', 'claude', 'llama', 'gemini'] as const;

export const aiModelConfigSchema = z.object({
  provider: z.enum(modelProviders),
  model: z.string().min(1, 'Model name is required'),
});

export const configurationSettingsSchema = z.object({
  openRouterApiKey: z.string().min(1, 'OpenRouter API key is required'),
  defaultModel: aiModelConfigSchema,
  systemPrompt: z.string().min(1, 'System prompt must not be empty'),
  evolutionApiUrl: z.string().url('Evolution API URL must be valid'),
  evolutionApiKey: z.string().min(1, 'Evolution API key is required'),
});

export type ConfigurationSettingsInput = z.infer<typeof configurationSettingsSchema>;

export const sanitizeConfiguration = (input: ConfigurationSettingsInput) =>
  configurationSettingsSchema.parse(input);

export const defaultConfiguration = (): ConfigurationSettingsInput => ({
  openRouterApiKey: '',
  defaultModel: {
    provider: 'gpt-4',
    model: 'gpt-4.1-mini',
  },
  systemPrompt:
    'Você é um assistente de IA que responde com base nas últimas instruções configuradas.',
  evolutionApiUrl: 'https://evodevs.cordex.ai',
  evolutionApiKey: '',
});

