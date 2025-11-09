import { useCallback, useEffect, useMemo, useState } from 'react';
import { modelProviders, type ModelProvider, type SettingsUpdateInput } from '@shared/index';

import { fetchSettings, updateSettings } from './api';
import { toFormState, type SettingsFormState, type SettingsResponse } from './types';

type Status = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export const useSettings = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [formState, setFormState] = useState<SettingsFormState | null>(null);
    const [snapshot, setSnapshot] = useState<SettingsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setStatus('loading');
                const data = await fetchSettings();
                setSnapshot(data);
                setFormState(toFormState(data));
                setStatus('idle');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
                setStatus('error');
            }
        })();
    }, []);

    const availableProviders = useMemo<ModelProvider[]>(() => [...modelProviders], []);

    const updateForm = useCallback(<Key extends keyof SettingsFormState>(key: Key, value: SettingsFormState[Key]) => {
        setFormState((prev) => (prev ? { ...prev, [key]: value } : prev));
    }, []);

    const save = useCallback(async () => {
        if (!formState) {
            return;
        }

        try {
            setStatus('saving');
            setError(null);

            const payload: SettingsUpdateInput = {
                defaultModel: {
                    provider: formState.defaultModelProvider,
                    model: formState.defaultModelName,
                },
                systemPrompt: formState.systemPrompt,
                evolutionApiUrl: formState.evolutionApiUrl,
            };

            if (formState.removeOpenRouterApiKey) {
                payload.openRouterApiKey = '';
            } else if (formState.openRouterApiKey.trim()) {
                payload.openRouterApiKey = formState.openRouterApiKey.trim();
            }

            if (formState.removeEvolutionApiKey) {
                payload.evolutionApiKey = '';
            } else if (formState.evolutionApiKey.trim()) {
                payload.evolutionApiKey = formState.evolutionApiKey.trim();
            }

            const data = await updateSettings(payload);
            setSnapshot(data);
            setFormState(toFormState(data));
            setStatus('success');
            setTimeout(() => setStatus('idle'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar configurações');
            setStatus('error');
        }
    }, [formState]);

    return {
        status,
        formState,
        snapshot,
        error,
        availableProviders,
        updateForm,
        save,
        resetKeys: () => {
            setFormState((prev) =>
                prev
                    ? {
                        ...prev,
                        openRouterApiKey: '',
                        evolutionApiKey: '',
                        removeOpenRouterApiKey: false,
                        removeEvolutionApiKey: false,
                    }
                    : prev,
            );
        },
        markRemoveOpenRouter: (value: boolean) => updateForm('removeOpenRouterApiKey', value),
        markRemoveEvolution: (value: boolean) => updateForm('removeEvolutionApiKey', value),
        setProvider: (provider: ModelProvider) => updateForm('defaultModelProvider', provider),
    };
};

