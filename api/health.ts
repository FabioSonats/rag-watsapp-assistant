import type { VercelRequest, VercelResponse } from '@vercel/node';
import { healthController } from './controllers/healthController';
import { AppError } from './domain/errors/AppError';
import { sendJson } from './utils/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'GET') {
            throw new AppError('Method not allowed', 405);
        }

        const payload = await healthController.index();
        sendJson(res, 200, { status: payload });
    } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('Internal server error');
        sendJson(res, appError.statusCode, {
            error: appError.message,
            details: appError.details,
        });
    }
}

