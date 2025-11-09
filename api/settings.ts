import type { VercelRequest, VercelResponse } from '@vercel/node';
import { settingsUpdateSchema } from '@rag-whatsapp-assistant/shared';

import { settingsController } from './controllers/settingsController';
import { AppError } from './domain/errors/AppError';
import { sendJson } from './utils/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const payload = await settingsController.index();
      return sendJson(res, 200, payload);
    }

    if (req.method === 'PUT') {
      const parsed = settingsUpdateSchema.parse(req.body ?? {});
      const payload = await settingsController.update(parsed);
      return sendJson(res, 200, payload);
    }

    throw new AppError('Method not allowed', 405);
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError('Bad Request', 400);
    sendJson(res, appError.statusCode, {
      error: appError.message,
      details: appError.details,
    });
  }
}

