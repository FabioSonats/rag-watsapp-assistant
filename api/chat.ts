import type { VercelRequest, VercelResponse } from '@vercel/node';

import { AppError } from '../backend/domain/errors/AppError';
import { sendJson } from '../backend/utils/http';
import { chatService, generateConversationId } from '../backend/services/chatService';

const handleError = (res: VercelResponse, error: unknown) => {
  const appError =
    error instanceof AppError
      ? error
      : new AppError('Erro interno ao processar requisição', 500, {
        reason: error instanceof Error ? error.message : undefined,
      });

  sendJson(res, appError.statusCode, {
    error: appError.message,
    details: appError.details,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('[api/chat] incoming', {
      method: req.method,
      query: req.query,
      hasBody: Boolean(req.body),
    });

    if (req.method === 'GET') {
      const conversationId =
        typeof req.query.conversationId === 'string'
          ? req.query.conversationId
          : req.query.conversationId?.[0];

      const targetConversationId = conversationId ?? generateConversationId();
      const result = await chatService.getHistory(targetConversationId);
      sendJson(res, 200, {
        conversationId: result.conversationId,
        reply: result.reply,
        messages: result.messages,
      });
      console.log('[api/chat] history delivered', {
        conversationId: result.conversationId,
        messages: result.messages.length,
      });
      return;
    }

    if (req.method === 'POST') {
      const payload =
        typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(req.body ?? '{}');

      const result = await chatService.sendMessage({
        conversationId:
          typeof payload.conversationId === 'string' ? payload.conversationId : undefined,
        message: typeof payload.message === 'string' ? payload.message : '',
      });

      sendJson(res, 200, {
        conversationId: result.conversationId,
        reply: result.reply,
        messages: result.messages,
      });
      console.log('[api/chat] message processed', {
        conversationId: result.conversationId,
        messages: result.messages.length,
      });
      return;
    }

    throw new AppError('Method not allowed', 405);
  } catch (error) {
    console.error('[api/chat] error', error);
    handleError(res, error);
  }
}


