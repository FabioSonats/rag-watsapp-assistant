import fetch from 'node-fetch';

import { env } from '../infra/env';

export interface EvolutionSendMessageInput {
  phoneNumberId: string;
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
    const response = await fetch(`${env.evolutionApiUrl}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.evolutionApiKey}`,
      },
      body: JSON.stringify({
        phoneNumberId: input.phoneNumberId ?? env.whatsappDefaultPhoneNumberId,
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

    return response.json();
  },
};

