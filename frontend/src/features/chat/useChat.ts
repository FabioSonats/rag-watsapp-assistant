import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { fetchConversation, sendChatMessage } from './api';
import type { ChatMessage, ChatStatus } from './types';

const STORAGE_KEY = 'rag-whatsapp-assistant.conversationId';

interface ChatState {
  conversationId: string | null;
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
}

const initialState: ChatState = {
  conversationId: null,
  messages: [],
  status: 'idle',
  error: null,
};

const loadConversationId = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistConversationId = (conversationId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, conversationId);
  } catch {
    // ignore
  }
};

export const useChat = () => {
  const [{ conversationId, messages, status, error }, setState] = useState<ChatState>(initialState);
  const pendingMessageRef = useRef<string | null>(null);

  const load = useCallback(
    async (existingConversationId?: string | null) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const result = await fetchConversation(existingConversationId ?? conversationId);
        persistConversationId(result.conversationId);
        setState({
          conversationId: result.conversationId,
          messages: result.messages,
          status: 'idle',
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Não foi possível carregar a conversa',
        }));
      }
    },
    [conversationId],
  );

  useEffect(() => {
    const existing = loadConversationId();
    void load(existing);
  }, [load]);

  const send = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) {
        return;
      }

      pendingMessageRef.current = trimmed;

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `pending-${Date.now()}`,
            role: 'user',
            content: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
        status: 'sending',
        error: null,
      }));

      try {
        const result = await sendChatMessage(conversationId, trimmed);
        persistConversationId(result.conversationId);
        setState({
          conversationId: result.conversationId,
          messages: result.messages,
          status: 'idle',
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Não foi possível enviar a mensagem',
        }));
      } finally {
        pendingMessageRef.current = null;
      }
    },
    [conversationId],
  );

  const isSending = status === 'sending';
  const isLoading = status === 'loading';

  const metadata = useMemo(
    () => ({
      isSending,
      isLoading,
      hasMessages: messages.length > 0,
    }),
    [isSending, isLoading, messages.length],
  );

  return {
    conversationId,
    messages,
    status,
    error,
    isSending,
    isLoading,
    metadata,
    load,
    send,
  };
};


