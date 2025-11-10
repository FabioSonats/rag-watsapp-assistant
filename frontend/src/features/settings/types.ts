import type {
  ConfigurationSettingsPublic,
  ConfigurationSettingsUpdate,
  ModelProvider,
} from '@rag-whatsapp-assistant/shared';

export type SettingsStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export type SettingsData = ConfigurationSettingsPublic;

export interface SettingsFormValues {
  openRouter: {
    apiKey: string;
    defaultProvider: ModelProvider;
    defaultModel: string;
  };
  evolution: {
    apiUrl: string;
    apiKey: string;
    defaultPhoneNumberId: string;
  };
  prompts: {
    system: string;
  };
}

export interface SettingsHookState {
  data: SettingsData | null;
  form: SettingsFormValues;
  status: SettingsStatus;
  message: string | null;
}

export type SettingsUpdatePayload = ConfigurationSettingsUpdate;

export const buildDefaultFormValues = (data: SettingsData | null): SettingsFormValues => ({
  openRouter: {
    apiKey: '',
    defaultProvider: data?.openRouter.defaultModel.provider ?? 'gpt-4',
    defaultModel: data?.openRouter.defaultModel.model ?? '',
  },
  evolution: {
    apiUrl: data?.evolution.apiUrl ?? '',
    apiKey: '',
    defaultPhoneNumberId: data?.evolution.defaultPhoneNumberId ?? '',
  },
  prompts: {
    system: data?.prompts.system ?? '',
  },
});

export const hasDirtyChanges = (
  a: SettingsFormValues,
  b: SettingsFormValues,
  includeSecrets: boolean,
) => {
  if (a.openRouter.defaultProvider !== b.openRouter.defaultProvider) return true;
  if (a.openRouter.defaultModel !== b.openRouter.defaultModel) return true;
  if (a.evolution.apiUrl !== b.evolution.apiUrl) return true;
  if (a.prompts.system !== b.prompts.system) return true;
  if (a.evolution.defaultPhoneNumberId !== b.evolution.defaultPhoneNumberId) return true;
  if (includeSecrets) {
    if (a.openRouter.apiKey.trim() !== '') return true;
    if (a.evolution.apiKey.trim() !== '') return true;
  }
  return false;
};

