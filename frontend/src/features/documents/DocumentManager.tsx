import { useCallback, useMemo, useRef, useState } from 'react';
import { useDocuments } from './useDocuments';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export function DocumentManager() {
  const { items, status, message, upload, remove, refresh, helpers } = useDocuments();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'loading':
        return 'Carregando documentos...';
      case 'uploading':
        return 'Enviando arquivos...';
      case 'success':
        return 'Documentos enviados com sucesso!';
      case 'error':
        return message ?? 'Algo deu errado.';
      default:
        return message ?? 'Gerencie seus arquivos de contexto.';
    }
  }, [status, message]);

  const handleFiles = useCallback(
    (files?: FileList | null) => {
      if (!files?.length) return;
      void upload(files);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [upload],
  );

  return (
    <section className="panel documents-panel">
      <header>
        <span className="chip">Contexto</span>
        <h1>Documentos RAG</h1>
        <p className="subtitle">
          Carregue PDFs, textos ou markdowns que servirão de base para as respostas. Os arquivos são
          processados e ficam prontos para consulta.
        </p>
      </header>

      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        role="button"
        tabIndex={0}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            inputRef.current?.click();
          }
        }}
      >
        <span className="dropzone-icon" aria-hidden="true">
          ⬆️
        </span>
        <div>
          <strong>Arraste arquivos aqui</strong>
          <p>ou clique para selecionar</p>
        </div>
        <small>Extensões aceitas: {helpers.allowedExtensions.join(', ').toUpperCase()}</small>
        <input
          ref={inputRef}
          type="file"
          className="hidden-input"
          accept=".pdf,.txt,.md,.json"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      <div className={`status-banner ${status}`}>
        <span>{statusLabel}</span>
        <button type="button" className="refresh-button" onClick={() => void refresh()}>
          Atualizar
        </button>
      </div>

      <div className="documents-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum documento enviado ainda.</p>
            <small>Comece arrastando os arquivos desejados.</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tamanho</th>
                <th>Status</th>
                <th>Atualizado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="doc-name">
                      <span>{doc.name}</span>
                      <small>{doc.mimeType}</small>
                    </div>
                  </td>
                  <td>{helpers.formatSize(doc.size)}</td>
                  <td>
                    <span className={`badge ${doc.status}`}>{doc.status}</span>
                  </td>
                  <td>{formatDate(doc.updatedAt)}</td>
                  <td>
                    <button type="button" className="ghost-button danger" onClick={() => void remove(doc.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

