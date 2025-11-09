import { describe, expect, it } from 'vitest';

import { buildStoragePath, createDocumentRecord, documentMetadataSchema } from './documents';

describe('documents utilities', () => {
    it('creates document record with defaults', () => {
        const record = createDocumentRecord({
            name: 'manual.pdf',
            mimeType: 'application/pdf',
            size: 1024,
            hash: 'abc123',
        });

        expect(record.status).toBe('processing');
        expect(record.storagePath).toContain(record.id);
        expect(record.storagePath).toContain('manual.pdf');
    });

    it('validates metadata via schema', () => {
        const record = createDocumentRecord({
            id: 'doc-123',
            name: 'readme.md',
            mimeType: 'text/markdown',
            size: 2048,
            hash: 'hash',
        });

        const parsed = documentMetadataSchema.parse(record);
        expect(parsed.id).toBe('doc-123');
    });

    it('builds storage path correctly', () => {
        expect(buildStoragePath('doc-1', 'file.pdf')).toBe('documents/doc-1/file.pdf');
    });
});

