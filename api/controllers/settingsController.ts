import type { SettingsSnapshot, SettingsUpdateInput } from '@rag-whatsapp-assistant/shared';

import { settingsService } from '../services/settingsService';

export const settingsController = {
  async index(): Promise<SettingsSnapshot> {
    return settingsService.get();
  },

  async update(payload: SettingsUpdateInput): Promise<SettingsSnapshot> {
    return settingsService.update(payload);
  },
};

