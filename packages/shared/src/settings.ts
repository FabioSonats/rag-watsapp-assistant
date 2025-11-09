import { z } from 'zod';

import { aiModelConfigSchema, defaultConfiguration } from './configuration';

const secretSchema = z
    .union([z.string().min(1, 'Secret must not be empty'), z.literal('')])
    .optional();

export const settingsDocumentSchema = z.object({
    defaultModel: aiModelConfigSchema.optional(),
    systemPrompt: z.string().optional(),
    evolutionApiUrl: z.string().optional(),
    openRouterApiKey: z.string().optional(),
    evolutionApiKey: z.string().optional(),
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
});

export const settingsUpdateSchema = z.object({
    defaultModel: aiModelConfigSchema.optional(),
    systemPrompt: z.string().min(1).optional(),
    evolutionApiUrl: z.string().url().optional(),
    openRouterApiKey: secretSchema,
    evolutionApiKey: secretSchema,
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

export interface SecretPreview {
    hasValue: boolean;
    preview: string | null;
}

export interface SettingsSnapshot {
    configuration: {
        defaultModel: z.infer<typeof aiModelConfigSchema>;
        systemPrompt: string;
        evolutionApiUrl: string;
    };
    secrets: {
        openRouterApiKey: SecretPreview;
        evolutionApiKey: SecretPreview;
    };
    timestamps: {
        createdAt: string;
        updatedAt: string;
    };
}

export const createDefaultSettingsDocument = () => {
    const defaults = defaultConfiguration();
    const now = new Date().toISOString();

    return {
        defaultModel: defaults.defaultModel,
        systemPrompt: defaults.systemPrompt,
        evolutionApiUrl: defaults.evolutionApiUrl,
        openRouterApiKey: undefined,
        evolutionApiKey: undefined,
        createdAt: now,
        updatedAt: now,
    };
};

