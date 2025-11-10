import type { DocumentItem } from './types';

const BASE_URL = '/api/documents';

export interface DocumentsResponse {
  documents: DocumentItem[];
}

export interface UploadResponse {
  document: DocumentItem;
}

export const fetchDocuments = async (): Promise<DocumentItem[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os documentos');
  }

  const data = (await response.json()) as DocumentsResponse;
  return data.documents ?? [];
};

export const uploadDocument = async (file: File): Promise<DocumentItem> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? 'Falha ao enviar documento');
  }

  const data = (await response.json()) as UploadResponse;
  return data.document;
};

export const deleteDocument = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? 'Não foi possível remover o documento');
  }
};

