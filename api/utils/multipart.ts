import Busboy from 'busboy';
import type { VercelRequest } from '@vercel/node';

import { AppError } from '../domain/errors/AppError';

export interface UploadedFile {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
}

const isMultipart = (contentType: string | undefined): boolean =>
    Boolean(contentType && contentType.includes('multipart/form-data'));

export const parseSingleFile = (req: VercelRequest): Promise<UploadedFile> =>
    new Promise((resolve, reject) => {
        const contentType = req.headers['content-type'];

        if (!isMultipart(contentType)) {
            reject(new AppError('Content-Type inválido, esperado multipart/form-data', 400));
            return;
        }

        const busboy = Busboy({ headers: req.headers });
        let fileBuffer: Buffer | null = null;
        let fileName = '';
        let mimeType = '';

        busboy.on('file', (_fieldname, file, info) => {
            const chunks: Buffer[] = [];
            fileName = info.filename;
            mimeType = info.mimeType;

            file.on('data', (chunk) => {
                chunks.push(chunk);
            });

            file.on('end', () => {
                fileBuffer = Buffer.concat(chunks);
            });
        });

        busboy.once('error', (error) => {
            reject(error);
        });

        busboy.once('finish', () => {
            if (!fileBuffer || !fileName) {
                reject(new AppError('Arquivo não encontrado no payload', 400));
                return;
            }

            resolve({
                buffer: fileBuffer,
                filename: fileName,
                mimeType,
                size: fileBuffer.length,
            });
        });

        req.pipe(busboy);
    });


