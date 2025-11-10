export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string | null;
}

export interface ChatSession {
  conversationId: string;
  messages: ChatMessage[];
}

export type ChatStatus = 'idle' | 'loading' | 'sending' | 'error';


