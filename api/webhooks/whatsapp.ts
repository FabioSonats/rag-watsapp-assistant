import type { VercelRequest, VercelResponse } from '@vercel/node';

import { AppError } from '../domain/errors/AppError';
import { env } from '../infra/env';
import { whatsappWebhookService } from '../services/whatsappWebhookService';
import { sendJson } from '../utils/http';

const verifyGetChallenge = (req: VercelRequest, res: VercelResponse) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.whatsappWebhookSecret && typeof challenge === 'string') {
    res.status(200).send(challenge);
    return true;
  }

  return false;
};

const verifySignature = (req: VercelRequest) => {
  if (!env.whatsappWebhookSecret) {
    return true;
  }

  const signature = req.headers['x-webhook-secret'] ?? req.headers['x-signature'];
  return signature === env.whatsappWebhookSecret;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const handled = verifyGetChallenge(req, res);
      if (!handled) {
        throw new AppError('Webhook verification failed', 403);
      }
      return;
    }

    if (req.method !== 'POST') {
      throw new AppError('Method not allowed', 405);
    }

    if (!verifySignature(req)) {
      throw new AppError('Invalid signature', 401);
    }

    const payload = req.body ?? {};
    await whatsappWebhookService.record({
      provider: 'evolution',
      payload,
      timestamp: new Date().toISOString(),
    });

    sendJson(res, 200, { acknowledged: true });
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError('Internal server error', 500, {
            details: error instanceof Error ? error.message : undefined,
          });

    sendJson(res, appError.statusCode, {
      error: appError.message,
      details: appError.details,
    });
  }
}

