import type { ConfigurationSettingsUpdate } from '@rag-whatsapp-assistant/shared';

import type { SettingsData } from './types';

const BASE_URL = '/api/settings';

const parseResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? 'Falha ao carregar configurações');
  }
  return (await response.json()) as SettingsData;
};

export const fetchSettings = async (): Promise<SettingsData> => {
  const response = await fetch(BASE_URL);
  return parseResponse(response);
};

export const updateSettings = async (
  payload: ConfigurationSettingsUpdate,
): Promise<SettingsData> => {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};


