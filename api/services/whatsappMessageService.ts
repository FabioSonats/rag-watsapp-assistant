import { AppError } from '../domain/errors/AppError';
import { evolutionApiClient } from './evolutionApiClient';

export interface SendWhatsAppMessageInput {
  to: string;
  body: string;
  phoneNumberId?: string;
}

export const whatsappMessageService = {
  async send(input: SendWhatsAppMessageInput) {
    if (!input.to || !input.body) {
      throw new AppError('Destinatário e conteúdo são obrigatórios', 400);
    }

    const response = await evolutionApiClient.sendMessage({
      to: input.to,
      body: input.body,
      phoneNumberId: input.phoneNumberId,
    });

    return response;
  },
};

