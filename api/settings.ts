import type { VercelRequest, VercelResponse } from '@vercel/node';

import { settingsController } from '../backend/controllers/settingsController';
import { AppError } from '../backend/domain/errors/AppError';
import { sendJson } from '../backend/utils/http';

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
    if (req.method === 'GET') {
      const payload = await settingsController.show();
      sendJson(res, 200, payload);
      return;
    }

    if (req.method === 'PUT') {
      const payload = await settingsController.update(req.body);
      sendJson(res, 200, payload);
      return;
    }

    throw new AppError('Method not allowed', 405);
  } catch (error) {
    handleError(res, error);
  }
}


