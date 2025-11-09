import type { VercelRequest, VercelResponse } from '@vercel/node';

type ResponseBody = Record<string, unknown> | string | boolean | number | null;

export const sendJson = (
    res: VercelResponse,
    statusCode: number,
    body: ResponseBody,
): void => {
    res.status(statusCode).json(
        typeof body === 'string' || typeof body === 'boolean' || typeof body === 'number'
            ? { data: body }
            : body,
    );
};

export const extractRequestContext = (req: VercelRequest) => ({
    method: req.method ?? 'GET',
    query: req.query,
    headers: req.headers,
    body: req.body,
});

