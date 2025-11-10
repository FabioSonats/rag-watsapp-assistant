import type { z } from 'zod';

import {
  aiModelConfigSchema,
  configurationSettingsPublicSchema,
  configurationSettingsSchema,
  configurationSettingsUpdateSchema,
  evolutionSettingsSchema,
  hasSecretValue,
  modelProviders,
  openRouterSettingsSchema,
  promptsSettingsSchema,
  redactSecretValue,
  sanitizeConfiguration,
  sanitizeConfigurationUpdate,
  type ConfigurationSettings,
  type ConfigurationSettingsPublic,
  type ConfigurationSettingsUpdate,
} from './configuration';
import {
  buildStoragePath,
  createDocumentRecord,
  documentMetadataSchema,
  documentStatusSchema,
  generateDocumentId,
  supportedMimeTypes,
  type DocumentRecord,
} from './documents';

export {
  aiModelConfigSchema,
  configurationSettingsPublicSchema,
  configurationSettingsSchema,
  configurationSettingsUpdateSchema,
  openRouterSettingsSchema,
  evolutionSettingsSchema,
  promptsSettingsSchema,
  modelProviders,
  sanitizeConfiguration,
  sanitizeConfigurationUpdate,
  hasSecretValue,
  redactSecretValue,
  buildStoragePath,
  createDocumentRecord,
  documentMetadataSchema,
  documentStatusSchema,
  generateDocumentId,
  supportedMimeTypes,
};
export type {
  ConfigurationSettings,
  ConfigurationSettingsPublic,
  ConfigurationSettingsUpdate,
  DocumentRecord,
};

export type ModelProvider = (typeof modelProviders)[number];
export type AiModelConfig = z.infer<typeof aiModelConfigSchema>;

export interface SystemPromptConfig {
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type { DocumentMetadata } from './documents';

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

