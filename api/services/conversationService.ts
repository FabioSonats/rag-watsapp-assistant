import { firestore } from '../infra/firebaseAdmin';

const CONVERSATIONS_COLLECTION = 'conversations';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  raw?: unknown;
}

export const conversationService = {
  async appendMessages(phoneNumber: string, messages: ConversationMessage[]): Promise<void> {
    if (!phoneNumber) {
      return;
    }

    const conversationRef = firestore.collection(CONVERSATIONS_COLLECTION).doc(phoneNumber);

    await conversationRef.set(
      {
        phoneNumber,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const messagesCollection = conversationRef.collection('messages');

    await Promise.all(
      messages.map((message) =>
        messagesCollection.add({
          role: message.role,
          content: message.content,
          raw: message.raw,
          createdAt: firestore.FieldValue.serverTimestamp(),
        }),
      ),
    );
  },
};

