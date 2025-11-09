import { describe, expect, it } from 'vitest';

import { sanitizeConfiguration } from './configuration';

describe('sanitizeConfiguration', () => {
  it('returns sanitized configuration when data is valid', () => {
    const result = sanitizeConfiguration({
      openRouterApiKey: 'sk-openrouter-test',
      defaultModel: { provider: 'gpt-4', model: 'gpt-4.1-mini' },
      systemPrompt: 'You are a helpful assistant.',
      evolutionApiUrl: 'https://example.com',
      evolutionApiKey: 'evo-key',
    });

    expect(result.defaultModel.provider).toBe('gpt-4');
  });

  it('throws when data is invalid', () => {
    expect(() =>
      sanitizeConfiguration({
        openRouterApiKey: '',
        defaultModel: { provider: 'gpt-4', model: 'gpt-4.1-mini' },
        systemPrompt: 'Prompt',
        evolutionApiUrl: 'https://example.com',
        evolutionApiKey: 'evo-key',
      }),
    ).toThrowError();
  });
});

