import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { ChatWindow } from '../features/chat/ChatWindow';
import { useChat } from '../features/chat/useChat';

export function ChatPage() {
  const { messages, conversationId, isLoading, isSending, error, load, send } = useChat();

  const handleRetry = useCallback(() => {
    void load(conversationId);
  }, [conversationId, load]);

  return (
    <div className="page-shell chat-page">
      <nav className="page-nav">
        <Link to="/">← Voltar</Link>
      </nav>

      <section className="panel chat-panel">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
          error={error}
          onSend={async (message) => {
            await send(message);
          }}
          onRetry={handleRetry}
        />
      </section>
    </div>
  );
}


