import type { VercelRequest, VercelResponse } from '@vercel/node';

import { documentController } from '../controllers/documentController';
import { AppError } from '../domain/errors/AppError';
import { sendJson } from '../utils/http';
import { parseSingleFile } from '../utils/multipart';

const handleError = (res: VercelResponse, error: unknown) => {
    const appError =
        error instanceof AppError
            ? error
            : new AppError('Erro interno ao processar requisição', 500);

    sendJson(res, appError.statusCode, {
        error: appError.message,
        details: appError.details,
    });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') {
            const documents = await documentController.index();
            sendJson(res, 200, { documents });
            return;
        }

        if (req.method === 'POST') {
            const file = await parseSingleFile(req);
            const document = await documentController.create(file);
            sendJson(res, 201, { document });
            return;
        }

        throw new AppError('Method not allowed', 405);
    } catch (error) {
        handleError(res, error);
    }
}


