import type { z } from 'zod';

import {
  aiModelConfigSchema,
  configurationSettingsSchema,
  defaultConfiguration,
  modelProviders,
  sanitizeConfiguration,
  type ConfigurationSettingsInput,
} from './configuration';
import {
  createDefaultSettingsDocument,
  settingsDocumentSchema,
  settingsUpdateSchema,
  type SecretPreview,
  type SettingsSnapshot,
  type SettingsUpdateInput,
} from './settings';

export {
  aiModelConfigSchema,
  configurationSettingsSchema,
  defaultConfiguration,
  modelProviders,
  sanitizeConfiguration,
  settingsDocumentSchema,
  settingsUpdateSchema,
  createDefaultSettingsDocument,
};
export type {
  ConfigurationSettingsInput,
  SettingsUpdateInput,
  SettingsSnapshot,
  SecretPreview,
};

export type ModelProvider = (typeof modelProviders)[number];
export type AiModelConfig = z.infer<typeof aiModelConfigSchema>;
export type ConfigurationSettings = z.infer<typeof configurationSettingsSchema>;

export interface SystemPromptConfig {
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  hash?: string;
  source?: 'upload' | 'manual';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  documentIds?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

