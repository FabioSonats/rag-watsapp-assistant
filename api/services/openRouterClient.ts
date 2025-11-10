import fetch from 'node-fetch';

import { env } from '../infra/env';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';

export const openRouterClient = {
  async chat(messages: ChatMessage[]): Promise<string> {
    if (!env.openRouterApiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.openRouterApiKey}`,
      },
      body: JSON.stringify({
        model: env.defaultModel.model,
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

