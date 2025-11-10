import { documentMetadataSchema } from '@rag-whatsapp-assistant/shared';

import { firestore, storageBucket } from '../infra/firebaseAdmin';

const DOCUMENTS_COLLECTION = 'documents';
const MAX_CONTEXT_CHARS = 4000;

const isReadableMime = (mimeType: string) =>
  mimeType.startsWith('text/') || mimeType === 'application/json';

export const ragContextService = {
  async buildContext(): Promise<string> {
    const snapshot = await firestore.collection(DOCUMENTS_COLLECTION).get();
    let accumulated = '';

    for (const doc of snapshot.docs) {
      const parsed = documentMetadataSchema.safeParse({
        id: doc.id,
        ...doc.data(),
      });

      if (!parsed.success) {
        continue;
      }

      const metadata = parsed.data;

      if (metadata.status !== 'ready' || !isReadableMime(metadata.mimeType)) {
        continue;
      }

      try {
        const [buffer] = await storageBucket.file(metadata.storagePath).download();
        const content = buffer.toString('utf-8').trim();

        if (!content) {
          continue;
        }

        accumulated += `\n\n[Título: ${metadata.name}]\n${content}`;

        if (accumulated.length > MAX_CONTEXT_CHARS) {
          accumulated = accumulated.slice(0, MAX_CONTEXT_CHARS);
          break;
        }
      } catch {
        continue;
      }
    }

    return accumulated.trim();
  },
};

