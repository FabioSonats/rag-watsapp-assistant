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

## Próximos Passos

- Implementar painel de configurações com tema pastel moderno.
- Implementar fluxo de upload/listagem/remoção de documentos utilizando Firebase Storage e Firestore.
- Implementar webhook WhatsApp com processamento RAG.
- Adicionar interface de chat local com histórico.
- Configurar deploy automático na Vercel e descrever passos completos no README.

