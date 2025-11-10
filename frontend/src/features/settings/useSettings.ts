import { useCallback, useMemo, useState } from 'react';

import type { ConfigurationSettingsUpdate } from '@rag-whatsapp-assistant/shared';

import { fetchSettings, updateSettings } from './api';
import {
  buildDefaultFormValues,
  hasDirtyChanges,
  type SettingsData,
  type SettingsFormValues,
  type SettingsStatus,
} from './types';

const initialState = (): {
  data: SettingsData | null;
  form: SettingsFormValues;
  status: SettingsStatus;
  message: string | null;
} => ({
  data: null,
  form: buildDefaultFormValues(null),
  status: 'idle',
  message: null,
});

export const useSettings = () => {
  const [{ data, form, status, message }, setState] = useState(initialState);
  const [initialForm, setInitialForm] = useState<SettingsFormValues>(buildDefaultFormValues(null));

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', message: null }));
    try {
      const settings = await fetchSettings();
      const defaults = buildDefaultFormValues(settings);
      setState({
        data: settings,
        form: defaults,
        status: 'idle',
        message: null,
      });
      setInitialForm(defaults);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível carregar as configurações',
      }));
    }
  }, []);

  const updateForm = useCallback(
    <K extends keyof SettingsFormValues>(section: K, values: Partial<SettingsFormValues[K]>) => {
      setState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          [section]: {
            ...prev.form[section],
            ...values,
          },
        },
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      form: initialForm,
      status: 'idle',
      message: null,
    }));
  }, [initialForm]);

  const save = useCallback(async () => {
    const payload: ConfigurationSettingsUpdate = {};

    if (form.openRouter.apiKey.trim()) {
      payload.openRouter = {
        ...(payload.openRouter ?? {}),
        apiKey: form.openRouter.apiKey.trim(),
        defaultModel: {
          provider: form.openRouter.defaultProvider,
          model: form.openRouter.defaultModel,
        },
      };
    } else if (
      form.openRouter.defaultProvider !== initialForm.openRouter.defaultProvider ||
      form.openRouter.defaultModel !== initialForm.openRouter.defaultModel
    ) {
      payload.openRouter = {
        ...(payload.openRouter ?? {}),
        defaultModel: {
          provider: form.openRouter.defaultProvider,
          model: form.openRouter.defaultModel,
        },
      };
    }

    if (form.evolution.apiKey.trim()) {
      payload.evolution = {
        ...(payload.evolution ?? {}),
        apiKey: form.evolution.apiKey.trim(),
      };
    }

    if (form.evolution.apiUrl !== initialForm.evolution.apiUrl) {
      payload.evolution = {
        ...(payload.evolution ?? {}),
        apiUrl: form.evolution.apiUrl,
      };
    }

    if (form.evolution.defaultPhoneNumberId !== initialForm.evolution.defaultPhoneNumberId) {
      payload.evolution = {
        ...(payload.evolution ?? {}),
        defaultPhoneNumberId: form.evolution.defaultPhoneNumberId
          ? form.evolution.defaultPhoneNumberId
          : null,
      };
    }

    if (form.prompts.system !== initialForm.prompts.system) {
      payload.prompts = {
        system: form.prompts.system,
      };
    }

    if (
      !payload.openRouter &&
      !payload.evolution &&
      !payload.prompts
    ) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        message: 'Nenhuma alteração para salvar',
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: 'saving', message: null }));

    try {
      const updated = await updateSettings(payload);
      const defaults = buildDefaultFormValues(updated);
      setState({
        data: updated,
        form: defaults,
        status: 'success',
        message: 'Configurações salvas com sucesso',
      });
      setInitialForm(defaults);
      setTimeout(() => {
        setState((prev) => ({ ...prev, status: 'idle', message: null }));
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Falha ao salvar configurações',
      }));
    }
  }, [form, initialForm]);

  const dirty = useMemo(
    () =>
      hasDirtyChanges(
        form,
        initialForm,
        Boolean(form.openRouter.apiKey.trim() || form.evolution.apiKey.trim()),
      ),
    [form, initialForm],
  );

  return {
    data,
    form,
    status,
    message,
    dirty,
    load,
    save,
    reset,
    updateForm,
  };
};


