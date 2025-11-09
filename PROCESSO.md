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

- Criação do serviço `settingsService` com Firestore (coleção `settings/platform`), incluindo mascaramento de segredos.
- Controller e rota `api/settings` com validações `zod` e suporte a atualizações parciais/limpeza de chaves.
- Painel React pastel consumindo a rota (`GET/PUT`), com UX para visualizar previews e remover credenciais.
- Hook `useSettings` para orquestrar fetch/salvar, feedback de status e composição de payload.
- Testes unitários com Vitest garantindo criação de defaults, merge e mascaramento de segredos.
- Atualização da documentação (`README.md`) cobrindo painel, rotas e instruções de uso.

## Próximos Passos

- Implementar fluxo de upload/listagem/remoção de documentos utilizando Firebase Storage e Firestore.
- Implementar webhook WhatsApp com processamento RAG.
- Adicionar interface de chat local com histórico.
- Configurar deploy automático na Vercel e descrever passos completos no README.

