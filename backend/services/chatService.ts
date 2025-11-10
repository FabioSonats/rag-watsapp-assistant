import crypto from 'node:crypto';

import { AppError } from '../domain/errors/AppError';
import { conversationService } from './conversationService';
import { openRouterClient } from './openRouterClient';
import { buildSystemPrompt } from './promptService';

const HISTORY_LIMIT = 15;

export interface ChatSendInput {
  conversationId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSendResult {
  conversationId: string;
  reply: string;
  messages: Awaited<ReturnType<typeof conversationService.getMessages>>;
}

const buildConversationMessages = (
  history: Awaited<ReturnType<typeof conversationService.getMessages>>,
  userMessage: string,
) => {
  const messages = [
    ...history.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  return messages;
};

export const generateConversationId = () => crypto.randomUUID();

export const chatService = {
  async getHistory(conversationId: string): Promise<ChatSendResult> {
    if (!conversationId) {
      throw new AppError('Conversation ID é obrigatório', 400);
    }

    await conversationService.ensureConversation(conversationId, { type: 'local' });
    const messages = await conversationService.getMessages(conversationId, HISTORY_LIMIT);

    console.log('[chatService] history', {
      conversationId,
      messages: messages.length,
    });

    return {
      conversationId,
      reply: '',
      messages,
    };
  },

  async sendMessage(input: ChatSendInput): Promise<ChatSendResult> {
    const trimmedMessage = input.message?.trim();
    if (!trimmedMessage) {
      throw new AppError('Mensagem vazia', 400);
    }

    const conversationId = input.conversationId ?? generateConversationId();

    console.log('[chatService] sendMessage', {
      conversationId,
      hasConversationId: Boolean(input.conversationId),
      snippet: trimmedMessage.slice(0, 80),
    });

    await conversationService.ensureConversation(conversationId, {
      type: 'local',
      title: trimmedMessage.slice(0, 60),
      ...input.metadata,
    });

    const history = await conversationService.getMessages(conversationId, HISTORY_LIMIT);
    const prompt = await buildSystemPrompt();

    const openRouterMessages = [
      { role: 'system' as const, content: prompt },
      ...buildConversationMessages(history, trimmedMessage),
    ];

    const assistantMessage =
      (await openRouterClient.chat(openRouterMessages)) ||
      'Tudo certo! Mensagem recebida, em breve trarei mais detalhes.';

    await conversationService.appendMessages(conversationId, [
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: assistantMessage },
    ]);

    const updated = await conversationService.getMessages(conversationId, HISTORY_LIMIT);

    console.log('[chatService] response', {
      conversationId,
      messages: updated.length,
    });

    return {
      conversationId,
      reply: assistantMessage,
      messages: updated,
    };
  },
};


