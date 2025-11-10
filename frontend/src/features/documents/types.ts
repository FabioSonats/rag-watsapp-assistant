export interface DocumentItem {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  status: 'processing' | 'ready' | 'failed';
  updatedAt: string;
}

export type RequestStatus = 'idle' | 'loading' | 'uploading' | 'success' | 'error';

export interface DocumentState {
  items: DocumentItem[];
  status: RequestStatus;
  message: string | null;
}

