import { useMemo, useState } from 'react';
import type { SettingsSnapshot } from '@shared/index';

import { useSettings } from './useSettings';

const SecretBadge = ({ secret }: { secret: SettingsSnapshot['secrets']['openRouterApiKey'] }) => {
    if (!secret.hasValue) {
        return <span className="secret-badge empty">Nenhum valor armazenado</span>;
    }

    return <span className="secret-badge">Salvo: {secret.preview}</span>;
};

const statusMessage: Record<string, string> = {
    idle: 'Configurações prontas para edição',
    loading: 'Carregando configurações…',
    saving: 'Salvando alterações…',
    success: 'Configurações atualizadas com sucesso!',
    error: 'Ocorreu um erro ao processar as configurações.',
};

export function SettingsForm() {
    const {
        formState,
        status,
        error,
        snapshot,
        availableProviders,
        updateForm,
        save,
        markRemoveEvolution,
        markRemoveOpenRouter,
        setProvider,
    } = useSettings();

    const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
    const [showEvolutionKey, setShowEvolutionKey] = useState(false);

    const isReadOnly = status === 'loading';

    const providerOptions = useMemo(
        () =>
            availableProviders.map((provider) => (
                <option key={provider} value={provider}>
                    {provider.toUpperCase()}
                </option>
            )),
        [availableProviders],
    );

    if (!formState || !snapshot) {
        return (
            <section className="panel">
                <header>
                    <h1>Painel de Configurações</h1>
                    <p>Buscando dados mais recentes…</p>
                </header>
            </section>
        );
    }

    return (
        <section className="panel">
            <header>
                <span className="chip">Administração</span>
                <h1>Painel de Configurações</h1>
                <p className="subtitle">
                    Ajuste as credenciais e o contexto do assistente. Valores sensíveis ficam armazenados de forma segura; você
                    pode sobrescrever ou limpar a qualquer momento.
                </p>
            </header>

            <form
                className="settings-grid"
                onSubmit={(event) => {
                    event.preventDefault();
                    void save();
                }}
            >
                <fieldset disabled={isReadOnly}>
                    <legend>OpenRouter</legend>
                    <label>
                        API Key
                        <div className="secret-input">
                            <input
                                type={showOpenRouterKey ? 'text' : 'password'}
                                placeholder="Digite uma nova chave ou deixe vazio para manter"
                                value={formState.openRouterApiKey}
                                onChange={(event) => updateForm('openRouterApiKey', event.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenRouterKey((prev) => !prev)}
                                className="ghost-button"
                            >
                                {showOpenRouterKey ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </label>
                    <div className="secret-meta">
                        <SecretBadge secret={snapshot.secrets.openRouterApiKey} />
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={formState.removeOpenRouterApiKey}
                                onChange={(event) => markRemoveOpenRouter(event.target.checked)}
                            />
                            Remover valor salvo
                        </label>
                    </div>

                    <label>
                        Provedor padrão
                        <select value={formState.defaultModelProvider} onChange={(event) => setProvider(event.target.value as typeof formState.defaultModelProvider)}>
                            {providerOptions}
                        </select>
                    </label>

                    <label>
                        Modelo padrão
                        <input
                            type="text"
                            value={formState.defaultModelName}
                            onChange={(event) => updateForm('defaultModelName', event.target.value)}
                            placeholder="Ex.: gpt-4.1-mini"
                        />
                    </label>
                </fieldset>

                <fieldset disabled={isReadOnly}>
                    <legend>Evolution API</legend>

                    <label>
                        URL base
                        <input
                            type="url"
                            value={formState.evolutionApiUrl}
                            onChange={(event) => updateForm('evolutionApiUrl', event.target.value)}
                            placeholder="https://evodevs.cordex.ai"
                        />
                    </label>

                    <label>
                        API Key
                        <div className="secret-input">
                            <input
                                type={showEvolutionKey ? 'text' : 'password'}
                                placeholder="Digite uma nova chave ou deixe vazio para manter"
                                value={formState.evolutionApiKey}
                                onChange={(event) => updateForm('evolutionApiKey', event.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowEvolutionKey((prev) => !prev)}
                                className="ghost-button"
                            >
                                {showEvolutionKey ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </label>
                    <div className="secret-meta">
                        <SecretBadge secret={snapshot.secrets.evolutionApiKey} />
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={formState.removeEvolutionApiKey}
                                onChange={(event) => markRemoveEvolution(event.target.checked)}
                            />
                            Remover valor salvo
                        </label>
                    </div>
                </fieldset>

                <fieldset disabled={isReadOnly}>
                    <legend>Prompt do sistema</legend>
                    <textarea
                        rows={6}
                        value={formState.systemPrompt}
                        onChange={(event) => updateForm('systemPrompt', event.target.value)}
                        placeholder="Defina o comportamento padrão do assistente..."
                    />
                </fieldset>

                <footer className="form-footer">
                    <div>
                        <p className={`status ${status}`}>
                            {statusMessage[status]}
                            {error ? ` — ${error}` : ''}
                        </p>
                        <small>
                            Última atualização: {new Date(snapshot.timestamps.updatedAt).toLocaleString('pt-BR')}
                        </small>
                    </div>
                    <button type="submit" disabled={status === 'saving'}>
                        {status === 'saving' ? 'Salvando…' : 'Salvar alterações'}
                    </button>
                </footer>
            </form>
        </section>
    );
}

