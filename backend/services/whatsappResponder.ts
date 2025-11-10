import { conversationService } from './conversationService';
import { openRouterClient } from './openRouterClient';
import { whatsappMessageService } from './whatsappMessageService';
import { buildSystemPrompt } from './promptService';

export interface IncomingWhatsAppMessage {
  phone: string;
  body: string;
  raw: unknown;
}

export const whatsappResponder = {
  async handleIncoming(message: IncomingWhatsAppMessage): Promise<string> {
    const prompt = await buildSystemPrompt();

    const assistantMessage =
      (await openRouterClient.chat([
        { role: 'system', content: prompt },
        { role: 'user', content: message.body },
      ])) ||
      'Consegui registrar sua mensagem. Em breve traremos mais detalhes.';

    await whatsappMessageService.send({
      to: message.phone,
      body: assistantMessage,
    });

    await conversationService.appendMessages(message.phone, [
      { role: 'user', content: message.body, raw: message.raw },
      { role: 'assistant', content: assistantMessage },
    ]);

    return assistantMessage;
  },
};

