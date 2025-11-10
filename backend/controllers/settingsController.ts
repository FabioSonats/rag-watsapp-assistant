import type { ConfigurationSettingsPublic } from '@rag-whatsapp-assistant/shared';
import { settingsService } from '../services/settingsService';

export const settingsController = {
  async show(): Promise<ConfigurationSettingsPublic> {
    return settingsService.get();
  },

  async update(input: unknown): Promise<ConfigurationSettingsPublic> {
    return settingsService.update(input);
  },
};


