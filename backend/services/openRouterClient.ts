import fetch from 'node-fetch';

import { settingsService } from './settingsService';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';

export const openRouterClient = {
  async chat(messages: ChatMessage[]): Promise<string> {
    const settings = await settingsService.getCurrentSettings();
    const { apiKey, defaultModel } = settings.openRouter;

    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: defaultModel.model,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${error}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return json.choices?.[0]?.message?.content?.trim() ?? '';
  },
};

