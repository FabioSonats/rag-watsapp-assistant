import { conversationService } from './conversationService';
import { openRouterClient } from './openRouterClient';
import { ragContextService } from './ragContextService';
import { whatsappMessageService } from './whatsappMessageService';
import { settingsService } from './settingsService';

export interface IncomingWhatsAppMessage {
  phone: string;
  body: string;
  raw: unknown;
}

const buildPrompt = async () => {
  const settings = await settingsService.getCurrentSettings();
  const context = await ragContextService.buildContext();
  const basePrompt = settings.prompts.system;

  if (!context) {
    return basePrompt;
  }

  return `${basePrompt}\n\n=== CONTEXTO ===\n${context}\n\nUse apenas as informações acima para responder.`;
};

export const whatsappResponder = {
  async handleIncoming(message: IncomingWhatsAppMessage): Promise<string> {
    const prompt = await buildPrompt();

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

