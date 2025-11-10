import fetch from 'node-fetch';

import { AppError } from '../domain/errors/AppError';
import { settingsService } from './settingsService';

export interface EvolutionSendMessageInput {
  phoneNumberId?: string;
  to: string;
  body: string;
  type?: 'text';
}

export interface EvolutionResponse {
  messageId: string;
  status: string;
}

export const evolutionApiClient = {
  async sendMessage(input: EvolutionSendMessageInput): Promise<EvolutionResponse> {
    const settings = await settingsService.getCurrentSettings();
    const { apiUrl, apiKey, defaultPhoneNumberId } = settings.evolution;
    const phoneNumberId = input.phoneNumberId ?? defaultPhoneNumberId;

    if (!apiKey) {
      throw new AppError('Evolution API key não configurada', 500);
    }

    if (!apiUrl) {
      throw new AppError('Evolution API URL não configurada', 500);
    }

    if (!phoneNumberId) {
      throw new AppError('Nenhum phoneNumberId foi informado nem configurado no painel.', 400);
    }

    const response = await fetch(`${apiUrl}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        phoneNumberId,
        to: input.to,
        type: input.type ?? 'text',
        text: {
          body: input.body,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Evolution API error ${response.status}: ${error}`);
    }

    const data = (await response.json()) as Record<string, unknown>;

    const messageId = typeof data.messageId === 'string' ? data.messageId : null;
    const status = typeof data.status === 'string' ? data.status : null;

    if (!messageId || !status) {
      throw new Error('Evolution API retornou payload inesperado');
    }

    return {
      messageId,
      status,
    };
  },
};

