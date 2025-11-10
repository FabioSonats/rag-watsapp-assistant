import type { VercelRequest, VercelResponse } from '@vercel/node';

import { documentController } from '../controllers/documentController';
import { AppError } from '../domain/errors/AppError';
import { sendJson } from '../utils/http';

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
        if (req.method !== 'DELETE') {
            throw new AppError('Method not allowed', 405);
        }

        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            throw new AppError('Documento inválido', 400);
        }

        await documentController.remove(id);
        res.status(204).end();
    } catch (error) {
        handleError(res, error);
    }
}


