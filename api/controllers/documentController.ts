import type { DocumentListItem } from '../services/documentService';
import { documentService } from '../services/documentService';
import type { UploadedFile } from '../utils/multipart';

export const documentController = {
    async index(): Promise<DocumentListItem[]> {
        return documentService.list();
    },

    async create(file: UploadedFile): Promise<DocumentListItem> {
        return documentService.upload(file);
    },

    async remove(id: string): Promise<void> {
        return documentService.remove(id);
    },
};


