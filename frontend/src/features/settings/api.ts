import type { ConfigurationSettingsInput, SettingsUpdateInput } from '@shared/index';

import type { SettingsResponse } from './types';

const API_ROUTE = '/api/settings';

const headers = {
  'Content-Type': 'application/json',
};

export const fetchSettings = async (): Promise<SettingsResponse> => {
  const response = await fetch(API_ROUTE, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Falha ao carregar configurações');
  }

  return response.json();
};

export const updateSettings = async (payload: SettingsUpdateInput): Promise<SettingsResponse> => {
  const response = await fetch(API_ROUTE, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload satisfies Partial<ConfigurationSettingsInput>),
  });

  if (!response.ok) {
    throw new Error('Falha ao salvar configurações');
  }

  return response.json();
};

