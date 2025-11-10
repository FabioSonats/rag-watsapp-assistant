import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { modelProviders } from '@rag-whatsapp-assistant/shared';

import { useSettings } from './useSettings';

const providerLabels: Record<string, string> = {
  'gpt-4': 'OpenAI (via OpenRouter)',
  claude: 'Anthropic Claude',
  llama: 'Meta LLaMA',
  gemini: 'Google Gemini',
};

export function SettingsPanel() {
  const { data, form, status, message, dirty, load, save, reset, updateForm } = useSettings();

  useEffect(() => {
    void load();
  }, [load]);

  const isLoading = status === 'loading' && !data;
  const isSaving = status === 'saving';

  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link to="/">← Voltar</Link>
      </nav>

      <section className="panel settings-panel">
        <header className="panel-header">
          <span className="chip">Configurações</span>
          <h1>Painel de Configurações</h1>
          <p className="subtitle">
            Gerencie credenciais, ajuste o modelo padrão e mantenha o prompt alinhado com o propósito do
            assistente.
          </p>
          {data?.metadata.updatedAt && (
            <small className="muted">
              Última atualização:{' '}
              <strong>{new Date(data.metadata.updatedAt).toLocaleString('pt-BR')}</strong> · origem:{' '}
              {data.metadata.source === 'firestore' ? 'Firestore' : 'Variáveis de ambiente'}
            </small>
          )}
        </header>

        {message && (
          <div
            className={`status-banner ${
              status === 'error' ? 'error' : status === 'success' ? 'success' : ''
            }`}
          >
            <span>{message}</span>
            {status === 'error' && (
              <button type="button" className="ghost-button" onClick={() => void load()} disabled={isLoading}>
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="settings-placeholder">
            <div className="placeholder-block" />
            <div className="placeholder-block" />
            <div className="placeholder-block" />
          </div>
        ) : (
          <>
            <div className="settings-grid">
              <div className="settings-card">
                <header>
                  <h2>OpenRouter</h2>
                  <p className="muted">Defina a chave e o modelo padrão para gerar respostas.</p>
                </header>

                <div className="form-field">
                  <label htmlFor="openrouter-key">API Key</label>
                  <input
                    id="openrouter-key"
                    type="password"
                    placeholder="sk-or-..."
                    value={form.openRouter.apiKey}
                    onChange={(event) =>
                      updateForm('openRouter', { apiKey: event.currentTarget.value })
                    }
                    autoComplete="off"
                  />
                  <small className="muted">
                    Status:{' '}
                    {data?.openRouter.apiKeyConfigured ? (
                      <span className="pill positive">
                        Configurado {data.openRouter.apiKeyPreview && `(${data.openRouter.apiKeyPreview})`}
                      </span>
                    ) : (
                      <span className="pill warning">Pendente</span>
                    )}
                  </small>
                </div>

                <div className="field-row">
                  <div className="form-field">
                    <label htmlFor="openrouter-provider">Provider</label>
                    <select
                      id="openrouter-provider"
                      value={form.openRouter.defaultProvider}
                      onChange={(event) =>
                        updateForm('openRouter', {
                          defaultProvider: event.currentTarget.value as typeof form.openRouter.defaultProvider,
                        })
                      }
                    >
                      {modelProviders.map((provider) => (
                        <option key={provider} value={provider}>
                          {providerLabels[provider] ?? provider}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="openrouter-model">Modelo padrão</label>
                    <input
                      id="openrouter-model"
                      type="text"
                      value={form.openRouter.defaultModel}
                      onChange={(event) =>
                        updateForm('openRouter', { defaultModel: event.currentTarget.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <header>
                  <h2>Evolution API</h2>
                  <p className="muted">
                    Configure a URL do serviço, chave de acesso e telefone padrão para o WhatsApp.
                  </p>
                </header>

                <div className="form-field">
                  <label htmlFor="evolution-url">Endpoint</label>
                  <input
                    id="evolution-url"
                    type="url"
                    value={form.evolution.apiUrl}
                    onChange={(event) => updateForm('evolution', { apiUrl: event.currentTarget.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="evolution-key">API Key</label>
                  <input
                    id="evolution-key"
                    type="password"
                    placeholder="Bearer ..."
                    value={form.evolution.apiKey}
                    onChange={(event) =>
                      updateForm('evolution', { apiKey: event.currentTarget.value })
                    }
                    autoComplete="off"
                  />
                  <small className="muted">
                    Status:{' '}
                    {data?.evolution.apiKeyConfigured ? (
                      <span className="pill positive">
                        Configurado {data.evolution.apiKeyPreview && `(${data.evolution.apiKeyPreview})`}
                      </span>
                    ) : (
                      <span className="pill warning">Pendente</span>
                    )}
                  </small>
                </div>

                <div className="form-field">
                  <label htmlFor="evolution-phone">Phone Number ID padrão</label>
                  <input
                    id="evolution-phone"
                    type="text"
                    value={form.evolution.defaultPhoneNumberId}
                    onChange={(event) =>
                      updateForm('evolution', {
                        defaultPhoneNumberId: event.currentTarget.value,
                      })
                    }
                  />
                  <small className="muted">
                    Opcional. Utilize o ID do número configurado na Evolution para envios automáticos.
                  </small>
                </div>
              </div>

              <div className="settings-card">
                <header>
                  <h2>Prompt do Assistente</h2>
                  <p className="muted">Base inicial que orienta o comportamento do modelo.</p>
                </header>

                <div className="form-field">
                  <label htmlFor="system-prompt">System prompt</label>
                  <textarea
                    id="system-prompt"
                    rows={8}
                    value={form.prompts.system}
                    onChange={(event) =>
                      updateForm('prompts', {
                        system: event.currentTarget.value,
                      })
                    }
                  />
                  <small className="muted">
                    O contexto RAG será anexado automaticamente durante a geração das respostas.
                  </small>
                </div>
              </div>
            </div>

            <footer className="form-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={reset}
                disabled={!dirty || isSaving}
              >
                Descartar alterações
              </button>
              <button
                type="button"
                className="ghost-button solid"
                onClick={() => void save()}
                disabled={(!dirty && !form.openRouter.apiKey && !form.evolution.apiKey) || isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}


