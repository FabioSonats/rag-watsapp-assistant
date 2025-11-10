import crypto from 'node:crypto';

import {
    createDocumentRecord,
    documentMetadataSchema,
    supportedMimeTypes,
} from '@rag-whatsapp-assistant/shared';

import { AppError } from '../domain/errors/AppError';
import { firestore, storageBucket } from '../infra/firebaseAdmin';
import type { UploadedFile } from '../utils/multipart';

const DOCUMENTS_COLLECTION = 'documents';

export interface DocumentListItem {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    status: 'processing' | 'ready' | 'failed';
    updatedAt: string;
}

const documentsCollection = firestore.collection(DOCUMENTS_COLLECTION);

const normalizeTimestamp = (value: unknown): string => {
    if (!value) {
        return new Date().toISOString();
    }
    if (typeof value === 'string') {
        return value;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    // Firestore Timestamp
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return new Date().toISOString();
};

const toDocumentListItem = (record: {
    id: string;
    data: Record<string, unknown>;
}): DocumentListItem | null => {
    const parsed = documentMetadataSchema.safeParse(record.data);
    if (!parsed.success) {
        return null;
    }

    const { name, mimeType, size, status, updatedAt } = parsed.data;

    return {
        id: record.id,
        name,
        mimeType,
        size,
        status,
        updatedAt: normalizeTimestamp(updatedAt),
    };
};

const validateUploadedFile = (file: UploadedFile) => {
    if (!file) {
        throw new AppError('Arquivo obrigatório', 400);
    }

    if (!supportedMimeTypes.includes(file.mimeType as (typeof supportedMimeTypes)[number])) {
        throw new AppError('Tipo de arquivo não suportado', 415);
    }

    if (file.size === 0) {
        throw new AppError('Arquivo vazio', 400);
    }
};

export const documentService = {
    async list(): Promise<DocumentListItem[]> {
        const snapshot = await documentsCollection.orderBy('updatedAt', 'desc').get();

        const items = snapshot.docs
            .map((doc) => toDocumentListItem({ id: doc.id, data: doc.data() }))
            .filter((item): item is DocumentListItem => Boolean(item));

        return items;
    },

    async upload(file: UploadedFile): Promise<DocumentListItem> {
        validateUploadedFile(file);

        const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
        const baseRecord = createDocumentRecord({
            name: file.filename,
            mimeType: file.mimeType,
            size: file.size,
            hash,
        });

        const docRef = documentsCollection.doc(baseRecord.id);
        const initialPayload = {
            name: baseRecord.name,
            mimeType: baseRecord.mimeType,
            size: baseRecord.size,
            status: baseRecord.status,
            storagePath: baseRecord.storagePath,
            hash: baseRecord.hash,
            createdAt: baseRecord.createdAt,
            updatedAt: baseRecord.updatedAt,
        };

        await docRef.set(initialPayload);

        try {
            await storageBucket.file(baseRecord.storagePath).save(file.buffer, {
                contentType: baseRecord.mimeType,
                resumable: false,
            });

            const updatedAt = new Date().toISOString();
            await docRef.update({
                status: 'ready',
                updatedAt,
            });

            return {
                id: baseRecord.id,
                name: baseRecord.name,
                mimeType: baseRecord.mimeType,
                size: baseRecord.size,
                status: 'ready',
                updatedAt,
            };
        } catch (error) {
            await docRef.update({
                status: 'failed',
                error: error instanceof Error ? error.message : 'Upload failed',
                updatedAt: new Date().toISOString(),
            });
            throw new AppError('Falha ao processar e armazenar documento', 500);
        }
    },

    async remove(id: string): Promise<void> {
        if (!id) {
            throw new AppError('Documento inválido', 400);
        }

        const docRef = documentsCollection.doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            throw new AppError('Documento não encontrado', 404);
        }

        const parsed = documentMetadataSchema.safeParse(snapshot.data());
        if (!parsed.success) {
            await docRef.delete();
            return;
        }

        const { storagePath } = parsed.data;

        try {
            await storageBucket.file(storagePath).delete();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Não foi possível remover o arquivo';
            throw new AppError(message, 500);
        }

        await docRef.delete();
    },
};


