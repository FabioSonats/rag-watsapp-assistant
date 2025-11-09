# RAG WhatsApp Assistant

Assistente inteligente com suporte a RAG e integração WhatsApp via Evolution API.

## Visão Geral

O projeto oferece:

- Painel de configuração de modelos OpenRouter e Evolution API;
- RAG com upload, listagem e remoção de documentos;
- Webhook WhatsApp para receber e responder mensagens usando contexto;
- Interface local de chat para testes e histórico;
- Deploy serverless na Vercel e persistência via Firebase (Firestore + Storage).

## Stack

- Frontend: React, TypeScript, Vite, Tailwind (tema pastel moderno);
- Backend: API Routes (Vercel Functions) em TypeScript;
- Banco: Firebase (Firestore + Cloud Storage);
- Testes: Vitest;
- Lint/Format: ESLint + Prettier.

## Configuração Local

1. **Pré-requisitos**: Node.js 20+, npm 10+, projeto Firebase (Firestore + Storage) e Evolution API.
2. **Instalação**:
   ```bash
   npm install
   npm run dev
   ```
   O comando acima instala todas as dependências (root + workspaces) e inicia o frontend em `localhost:5173`. As funções serverless podem ser testadas com `npm run vercel:dev`.
3. **Variáveis de Ambiente**:
   - Copie o arquivo `.env.example` para `.env.local` ou `.env` e preencha as chaves.
4. **Firebase**:
   - Crie um projeto e ative Firestore (modo produção) e Cloud Storage;
   - Gere uma Service Account com permissão de Admin SDK e baixe o JSON de credenciais;
   - Preencha as variáveis `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (respeitando o `\\n`) e, opcionalmente, `FIREBASE_STORAGE_BUCKET`.
5. **Painel de Configurações**:
   - Acesse `http://localhost:5173` para abrir o painel pastel;
   - Edite provedor/modelo padrão, prompt de sistema e credenciais (apenas strings preenchidas são enviadas);
   - Marcar “Remover valor salvo” limpa o segredo correspondente no Firestore.
6. **Testes**:
   ```bash
   npm test
   ```

## Deploy

- Criar projeto na Vercel e conectar ao repositório GitHub.
- Definir variáveis de ambiente com os mesmos valores do `.env`.
- Garantir que o Firebase (Service Account) esteja configurado com as variáveis no painel da Vercel.
- Para testar as funções localmente, use `vercel dev` (ou `npm run vercel:dev`).
- Para deploy manual, rode `npm run vercel:deploy`.

## Modelagem de dados (Firestore + Storage)

| Contexto | Estrutura | Observações |
| --- | --- | --- |
| Configurações | Coleção `settings` → documento único `platform` | Guarda prompts, modelos e chaves anonimizadas/criptografadas quando aplicável. |
| Documentos RAG | Coleção `documents` | Metadados (nome, hash, extensão, tamanho, referências de embeddings). Conteúdo bruto no Storage em `documents/{documentId}`. |
| Conversas | Coleção `conversations` | Campos `userId`, `title`, `createdAt`, `updatedAt`. Subcoleção `messages` com histórico (role, content, referências a documentos). |
| Logs/Webhooks | Coleção `webhook_events` (opcional) | Auditoria de entregas WhatsApp/Evolution API. |

> A modelagem foi pensada para escalar leituras pontuais (ex.: carregar um chat) e manter o conteúdo pesado no Storage com versionamento simples.

## Rotas disponíveis

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Status básico da aplicação. |
| `GET` | `/api/settings` | Retorna configuração atual com pré-visualização de segredos. |
| `PUT` | `/api/settings` | Atualiza modelo, prompt e chaves (campos enviados apenas). |

> Para remover uma chave, envie uma string vazia (`""`). Campos omitidos permanecem inalterados.

## Documentação adicional

- Detalhes das decisões e evolução: `PROCESSO.md`.
- Manual de API, esquemas de banco e fluxos serão adicionados ao longo das etapas seguintes.

