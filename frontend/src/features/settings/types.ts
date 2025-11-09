import type { ModelProvider, SettingsSnapshot } from '@shared/index';

export type SettingsResponse = SettingsSnapshot;

export interface SettingsFormState {
    defaultModelProvider: ModelProvider;
    defaultModelName: string;
    systemPrompt: string;
    evolutionApiUrl: string;
    openRouterApiKey: string;
    evolutionApiKey: string;
    removeOpenRouterApiKey: boolean;
    removeEvolutionApiKey: boolean;
}

export const toFormState = (response: SettingsResponse): SettingsFormState => ({
    defaultModelProvider: response.configuration.defaultModel.provider,
    defaultModelName: response.configuration.defaultModel.model,
    systemPrompt: response.configuration.systemPrompt,
    evolutionApiUrl: response.configuration.evolutionApiUrl,
    openRouterApiKey: '',
    evolutionApiKey: '',
    removeOpenRouterApiKey: false,
    removeEvolutionApiKey: false,
});

