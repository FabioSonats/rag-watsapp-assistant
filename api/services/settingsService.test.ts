import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockStore = {
  data: null as Record<string, unknown> | null,
  exists: false,
};

const get = vi.fn(async () => ({
  exists: mockStore.exists,
  data: () => mockStore.data,
}));

const set = vi.fn(async (payload: Record<string, unknown>, options?: { merge?: boolean }) => {
  if (options?.merge && mockStore.data) {
    mockStore.data = { ...mockStore.data, ...payload };
  } else {
    mockStore.data = { ...payload };
  }
  mockStore.exists = true;
});

vi.mock('../infra/firebaseAdmin', () => ({
  firestore: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get,
        set,
      })),
    })),
  },
}));

const { settingsService } = await import('./settingsService');

describe('settingsService', () => {
  beforeEach(() => {
    mockStore.data = null;
    mockStore.exists = false;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates default document when not found', async () => {
    const result = await settingsService.get();

    expect(result.configuration.defaultModel.provider).toBe('gpt-4');
    expect(result.configuration.systemPrompt.length).toBeGreaterThan(0);
    expect(set).toHaveBeenCalledTimes(1);
  });

  it('merges updates and hides secrets in snapshot', async () => {
    mockStore.exists = true;
    mockStore.data = {
      defaultModel: { provider: 'claude', model: 'claude-3-haiku' },
      systemPrompt: 'Assistente atual',
      evolutionApiUrl: 'https://evodevs.cordex.ai',
      openRouterApiKey: 'test-open-router-key',
      evolutionApiKey: 'test-evolution-key',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await settingsService.update({
      defaultModel: { provider: 'llama', model: 'llama-3.1-8b' },
      systemPrompt: 'Novo prompt',
    });

    expect(set).toHaveBeenCalled();
    expect(result.configuration.defaultModel.provider).toBe('llama');
    expect(result.secrets.openRouterApiKey.hasValue).toBe(true);
    expect(result.secrets.openRouterApiKey.preview).toContain('test');
    expect(result.secrets.openRouterApiKey.preview).toContain('••••');
  });
});

