# RAG WhatsApp Assistant

Assistente inteligente com suporte a RAG e integração WhatsApp via Evolution API.

## Visão Geral

O projeto oferece:

- Painel pastel de configurações (OpenRouter, Evolution API, prompt padrão) com persistência no Firestore;
- RAG com upload, listagem e remoção de documentos;
- Webhook WhatsApp para receber e responder mensagens usando contexto;
- Interface local de chat (estilo WhatsApp) para testes antes da publicação;
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
   npm run vercel:dev # terminal A - backend (Vercel Functions)
   npm run dev        # terminal B - frontend (proxy http://localhost:5173 -> 3000)
   ```
   O comando acima instala todas as dependências (root + workspaces). É necessário manter **dois terminais** ativos: um para as funções (`vercel dev` em `localhost:3000`) e outro para o frontend (`localhost:5173`, com proxy automático para `/api`).
3. **Variáveis de Ambiente**:
   - Copie o arquivo `.env.example` para `.env.local` ou `.env` e preencha as chaves.
4. **Firebase**:
   - Crie um projeto e ative Firestore (modo produção) e Cloud Storage;
   - Gere uma Service Account com permissão de Admin SDK e baixe o JSON de credenciais;
   - Preencha as variáveis `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (respeitando o `\\n`) e, opcionalmente, `FIREBASE_STORAGE_BUCKET`.
5. **Testes**:
   ```bash
   npm test
   ```
6. **Build**:
   ```bash
   npm run build
   ```
   Gera bundles do pacote compartilhado e do frontend, reproduzindo o processo de deploy.

## Funcionalidades

- **Painel de configurações** (`/settings`):
  - salva chaves do OpenRouter/Evolution API, modelo padrão e system prompt diretamente no Firestore;
  - exibe status de configuração com prévias mascaradas (as chaves reais não são retornadas).
- **Documentos RAG** (`/documents`):
  - upload/listagem/remoção de PDFs, TXT, Markdown e JSON (armazenados no Storage + metadados no Firestore);
  - o contexto dos documentos alimenta as respostas do chat/WhatsApp.
- **Chat interno** (`/chat`):
  - interface estilo WhatsApp para testar o assistente;
  - usa as mesmas configurações salvas e registra histórico na coleção `conversations`.
- **Webhook WhatsApp** (`/api/webhooks/whatsapp`):
  - recebe eventos da Evolution API, consulta RAG, gera resposta com OpenRouter e envia de volta via Evolution.

### API `/api/settings`

- **GET**: retorna as configurações persistidas com metadados e status das chaves (somente prévias mascaradas; os valores reais não são expostos).
- **PUT**: recebe payload parcial para atualizar os blocos desejados.

Exemplo:

```json
{
  "openRouter": {
    "apiKey": "sk-openrouter-...",
    "defaultModel": { "provider": "gpt-4", "model": "gpt-4.1-mini" }
  },
  "evolution": {
    "apiUrl": "https://evodevs.cordex.ai",
    "apiKey": "evo-...",
    "defaultPhoneNumberId": "123456789"
  },
  "prompts": {
    "system": "Você é um assistente que responde com base nos documentos disponíveis e diretrizes abaixo..."
  }
}
```

- Para limpar `defaultPhoneNumberId`, envie `null`.
- Para manter uma chave secreta existente, basta não enviar o campo (`apiKey`).

### API `/api/chat`

- **GET**: obtém (ou cria) uma conversa local. Passe `conversationId` opcional (`/api/chat?conversationId=...`) para recuperar uma conversa específica.
- **POST**: envia uma mensagem para o assistente e retorna a conversa atualizada.

Payload:

```json
{
  "conversationId": "opcional-uuid",
  "message": "Olá! Pode me ajudar com o material do onboarding?"
}
```

## Deploy

- Criar projeto na Vercel e conectar ao repositório GitHub.
- Definir variáveis de ambiente com os mesmos valores do `.env`.
- Garantir que o Firebase (Service Account) esteja configurado com as variáveis no painel da Vercel.

## Modelagem de dados (Firestore + Storage)

| Contexto | Estrutura | Observações |
| --- | --- | --- |
| Configurações | Coleção `settings` → documento único `platform` | Guarda prompts, modelos e chaves anonimizadas/criptografadas quando aplicável. |
| Documentos RAG | Coleção `documents` | Metadados (nome, hash, extensão, tamanho, referências de embeddings). Conteúdo bruto no Storage em `documents/{documentId}`. |
| Conversas | Coleção `conversations` | Campos `userId`, `title`, `createdAt`, `updatedAt`. Subcoleção `messages` com histórico (role, content, referências a documentos). |
| Logs/Webhooks | Coleção `webhook_events` (opcional) | Auditoria de entregas WhatsApp/Evolution API. |

> A modelagem foi pensada para escalar leituras pontuais (ex.: carregar um chat) e manter o conteúdo pesado no Storage com versionamento simples.
- Usar `npm run vercel:deploy` para deploy manual quando necessário.

## Documentação adicional

- Detalhes das decisões e evolução: `PROCESSO.md`.
- Manual de API, esquemas de banco e fluxos serão adicionados ao longo das etapas seguintes.

