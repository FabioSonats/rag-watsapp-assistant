import crypto from 'node:crypto';
import { z } from 'zod';

export const supportedMimeTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/json',
] as const;

export const documentStatusSchema = z.enum(['processing', 'ready', 'failed']);

export interface DocumentRecord {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    status: z.infer<typeof documentStatusSchema>;
    storagePath: string;
    hash: string;
    error?: string;
}

export const documentMetadataSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    mimeType: z.enum(supportedMimeTypes),
    size: z.number().positive(),
    status: documentStatusSchema,
    storagePath: z.string().min(1),
    hash: z.string().min(1),
    createdAt: z.union([z.string(), z.date()]),
    updatedAt: z.union([z.string(), z.date()]),
    error: z.string().optional(),
});

export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;

export const generateDocumentId = () => crypto.randomUUID();

export const buildStoragePath = (documentId: string, filename: string) =>
    `documents/${documentId}/${filename}`;

export const createDocumentRecord = (input: {
    id?: string;
    name: string;
    mimeType: string;
    size: number;
    hash: string;
}): DocumentRecord => {
    const now = new Date().toISOString();
    const id = input.id ?? generateDocumentId();

    return {
        id,
        name: input.name,
        mimeType: input.mimeType,
        size: input.size,
        hash: input.hash,
        status: 'processing',
        storagePath: buildStoragePath(id, input.name),
        createdAt: now,
        updatedAt: now,
    };
};

