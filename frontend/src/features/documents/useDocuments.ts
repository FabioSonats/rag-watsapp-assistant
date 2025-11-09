import { useCallback, useEffect, useMemo, useState } from 'react';

import { deleteDocument, fetchDocuments, uploadDocument } from './api';
import type { DocumentItem, RequestStatus } from './types';

const allowedExtensions = ['pdf', 'txt', 'md', 'json'];

const validateExtension = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useDocuments = () => {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const documents = await fetchDocuments();
      setItems(documents);
      setMessage(null);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Erro ao carregar documentos');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const collection = Array.from(files);
      const invalid = collection.filter((file) => !validateExtension(file.name));

      if (invalid.length > 0) {
        setStatus('error');
        setMessage(`Arquivos inválidos: ${invalid.map((file) => file.name).join(', ')}`);
        return;
      }

      setStatus('uploading');
      setMessage(null);

      try {
        const uploaded = await Promise.all(collection.map((file) => uploadDocument(file)));
        setItems((prev) => [...uploaded, ...prev]);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Erro ao enviar documento');
      }
    },
    [],
  );

  const remove = useCallback(
    async (id: string) => {
      const current = items.find((item) => item.id === id);
      setItems((prev) => prev.filter((item) => item.id !== id));

      try {
        await deleteDocument(id);
      } catch (err) {
        if (current) {
          setItems((prev) => [current, ...prev]);
        }
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Erro ao remover documento');
      }
    },
    [items],
  );

  const helpers = useMemo(
    () => ({
      allowedExtensions,
      formatSize,
    }),
    [],
  );

  return {
    items,
    status,
    message,
    upload,
    remove,
    refresh,
    helpers,
  };
};

