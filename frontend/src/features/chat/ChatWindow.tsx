import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { ChatMessage } from './types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  onSend: (message: string) => Promise<void> | void;
  onRetry: () => Promise<void> | void;
}

const formatTimestamp = (timestamp: string | null) => {
  if (!timestamp) {
    return '';
  }

  try {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  } catch {
    return '';
  }
};

export function ChatWindow({ messages, isLoading, isSending, error, onSend, onRetry }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = useMemo(() => {
    return messages.map((message) => ({
      ...message,
      bubbleClass: message.role === 'user' ? 'chat-bubble user' : 'chat-bubble assistant',
      timestamp: formatTimestamp(message.createdAt),
    }));
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    setInput('');
    await onSend(trimmed);
  };

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <div className="chat-avatar">AI</div>
        <div className="chat-meta">
          <strong>Assistente Contextual</strong>
          <span className={isSending ? 'status typing' : 'status online'}>
            {isSending ? 'Digitando...' : 'Online'}
          </span>
        </div>
        <button className="ghost-button" type="button" onClick={() => onRetry()} disabled={isLoading || isSending}>
          Recarregar
        </button>
      </header>

      <div className="chat-body" ref={listRef}>
        {isLoading && (
          <div className="chat-placeholder">
            <div className="placeholder-line" />
            <div className="placeholder-line short" />
          </div>
        )}

        {!isLoading && groupedMessages.length === 0 && (
          <div className="chat-empty">
            <p>Envie uma mensagem para iniciar a conversa.</p>
          </div>
        )}

        {!isLoading &&
          groupedMessages.map((message) => (
            <div className={message.bubbleClass} key={message.id}>
              <p>{message.content}</p>
              {message.timestamp && <span className="timestamp">{message.timestamp}</span>}
            </div>
          ))}
      </div>

      {error && (
        <div className="status-banner error">
          <span>{error}</span>
          <button className="ghost-button" type="button" onClick={() => onRetry()}>
            Tentar novamente
          </button>
        </div>
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="Digite uma mensagem"
          rows={1}
          disabled={isSending}
        />
        <button type="submit" className="ghost-button solid" disabled={isSending}>
          Enviar
        </button>
      </form>
    </div>
  );
}


