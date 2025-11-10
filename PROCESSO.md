# Processo de Desenvolvimento

## Etapa 1 — Configuração Inicial

- Definição de stack e arquitetura em camadas (domain, services, controllers).
- Criação do monorepo com workspaces (`frontend`, `packages/shared`).
- Configuração de lint, formatador e testes (ESLint, Prettier, Vitest).
- Estruturação inicial do backend (diretórios e utilitários base, `AppError`, helpers HTTP).
- Configuração de tipagens e validações compartilhadas com `zod`.
- Migração da camada de infraestrutura para Firebase (Firestore + Storage) e validação de variáveis de ambiente.
- Criação de testes iniciais para validação de configuração.
- Criação de placeholders de documentação (`README.md`, `PROCESSO.md`).

## Etapa 2 — Painel de Configurações

- Criação do schema compartilhado para configurações (`packages/shared/src/configuration.ts`), incluindo helpers de mascaramento.
- Implementação do serviço `settingsService` (Firestore) com fallback para variáveis de ambiente.
- API `GET/PUT /api/settings` com sanitização de entrada e saída.
- Interface pastel no frontend (`/settings`) com formulários para OpenRouter, Evolution API e prompt do assistente.
- Atualização do README com instruções de uso/local e rota da API.

## Próximos Passos

- Implementar fluxo de upload/listagem/remoção de documentos utilizando Firebase Storage e Firestore.
- Implementar webhook WhatsApp com processamento RAG.
- Adicionar interface de chat local com histórico.
- Configurar deploy automático na Vercel e descrever passos completos no README.

