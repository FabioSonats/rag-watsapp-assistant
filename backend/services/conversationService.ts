import { FieldValue } from 'firebase-admin/firestore';

import { firestore } from '../infra/firebaseAdmin';

const CONVERSATIONS_COLLECTION = 'conversations';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  raw?: unknown;
}

export interface StoredConversationMessage extends ConversationMessage {
  id: string;
  createdAt: string | null;
}

const buildConversationRef = (conversationId: string) =>
  firestore.collection(CONVERSATIONS_COLLECTION).doc(conversationId);

const toStoredMessage = (doc: FirebaseFirestore.QueryDocumentSnapshot): StoredConversationMessage => {
  const data = doc.data();
  const createdAt = data.createdAt;
  return {
    id: doc.id,
    role: data.role,
    content: data.content,
    raw: data.raw,
    createdAt:
      createdAt && typeof createdAt.toDate === 'function'
        ? createdAt.toDate().toISOString()
        : createdAt ?? null,
  };
};

export const conversationService = {
  async ensureConversation(
    conversationId: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    if (!conversationId) {
      return;
    }

    const conversationRef = buildConversationRef(conversationId);

    await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(conversationRef);

      if (!snapshot.exists) {
        transaction.set(conversationRef, {
          ...metadata,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      transaction.update(conversationRef, {
        ...metadata,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  },

  async appendMessages(conversationId: string, messages: ConversationMessage[]): Promise<void> {
    if (!conversationId || messages.length === 0) {
      return;
    }

    await conversationService.ensureConversation(conversationId);

    const messagesCollection = buildConversationRef(conversationId).collection('messages');

    await Promise.all(
      messages.map((message) =>
        messagesCollection.add({
          role: message.role,
          content: message.content,
          raw: message.raw,
          createdAt: FieldValue.serverTimestamp(),
        }),
      ),
    );
  },

  async getMessages(conversationId: string, limit = 50): Promise<StoredConversationMessage[]> {
    if (!conversationId) {
      return [];
    }

    const messagesCollection = buildConversationRef(conversationId).collection('messages');
    const snapshot = await messagesCollection.orderBy('createdAt', 'asc').limit(limit).get();

    return snapshot.docs.map(toStoredMessage);
  },
};

