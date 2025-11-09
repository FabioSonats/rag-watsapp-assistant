import { firestore } from '../infra/firebaseAdmin';

const WEBHOOK_COLLECTION = 'webhook_events';

export interface WhatsAppWebhookEvent {
  id?: string;
  timestamp: string;
  provider: 'evolution';
  payload: unknown;
}

export const whatsappWebhookService = {
  async record(event: WhatsAppWebhookEvent): Promise<void> {
    const collection = firestore.collection(WEBHOOK_COLLECTION);
    const timestamp = event.timestamp ?? new Date().toISOString();

    await collection.add({
      provider: event.provider,
      payload: event.payload,
      timestamp,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  },
};

