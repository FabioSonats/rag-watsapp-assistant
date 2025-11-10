import { describe, expect, it } from 'vitest';

import { sanitizeConfiguration } from './configuration';

describe('sanitizeConfiguration', () => {
  it('returns sanitized configuration when data is valid', () => {
    const result = sanitizeConfiguration({
      openRouter: {
        apiKey: 'sk-openrouter-test',
        defaultModel: { provider: 'gpt-4', model: 'gpt-4.1-mini' },
      },
      evolution: {
        apiUrl: 'https://example.com',
        apiKey: 'evo-key',
        defaultPhoneNumberId: '123',
      },
      prompts: {
        system: 'You are a helpful assistant.',
      },
    });

    expect(result.openRouter.defaultModel.provider).toBe('gpt-4');
    expect(result.evolution.defaultPhoneNumberId).toBe('123');
  });

  it('throws when data is invalid', () => {
    expect(() =>
      sanitizeConfiguration({
        openRouter: {
          apiKey: '',
          defaultModel: { provider: 'gpt-4', model: 'gpt-4.1-mini' },
        },
        evolution: {
          apiUrl: 'https://example.com',
          apiKey: 'evo-key',
        },
        prompts: { system: 'Prompt' },
      }),
    ).toThrowError();
  });
});

