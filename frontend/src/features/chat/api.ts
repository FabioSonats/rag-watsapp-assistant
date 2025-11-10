import type { ChatSession } from './types';

const BASE_URL = '/api/chat';

const parseResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? 'Falha ao comunicar com o assistente');
  }
  return (await response.json()) as ChatSession;
};

export const fetchConversation = async (conversationId?: string | null): Promise<ChatSession> => {
  const url = conversationId ? `${BASE_URL}?conversationId=${conversationId}` : BASE_URL;
  const response = await fetch(url);
  return parseResponse(response);
};

export const sendChatMessage = async (
  conversationId: string | null,
  message: string,
): Promise<ChatSession> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId: conversationId ?? undefined,
      message,
    }),
  });

  return parseResponse(response);
};


