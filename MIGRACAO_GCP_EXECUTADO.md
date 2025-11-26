# Relatório de Execução — Migração GCP (Guardião Digital)

## Contexto e Objetivo
- Migrar de site estático para aplicação com backend serverless em Google Cloud.
- Backend com Vertex AI (Gemini), Web Risk e Speech‑to‑Text.
- Frontend `js/main.js` refatorado para consumir a API local (`http://localhost:8080`).

## Backend Criado/Ajustado
- Estrutura de pastas:
  - `backend/`
    - `package.json` — scripts e dependências do Functions Framework.
    - `.env` — variáveis de ambiente (preenchidas por você).
    - `index.js` — roteamento Functions Framework.
    - `src/utils.js` — CORS mínimo e tratamento universal.
    - `src/ai-text.js` — análise de mensagens com Vertex AI (JSON estrito).
    - `src/ai-link.js` — verificação Web Risk + análise de URL com Gemini.
    - `src/ai-voice.js` — ingestão de áudio multipart, Speech‑to‑Text, repasse para texto.
- Roteamento (`backend/index.js`):
  - `POST /analyze-message` → `analyzeMessage`
  - `POST /analyze-link` → `analyzeLink`
  - `POST /analyze-voice` → `analyzeVoice`
- Arquivos e pontos principais:
  - `backend/package.json` — nome, scripts, deps do Functions Framework e Google SDKs.
  - `backend/src/utils.js` — `runWithCors` aplica CORS (`origin: true`) e captura erros.
  - `backend/src/ai-text.js` — inicializa Vertex AI com `GOOGLE_CLOUD_PROJECT_ID` e `GOOGLE_CLOUD_LOCATION`, usa `gemini-1.5-flash-001`, retorna JSON com `{status, summary, reasons, tips}`.
  - `backend/src/ai-link.js` — consulta `WebRisk.searchUris`; se ameaça, retorna `danger`; caso contrário, usa Gemini para análise sem acessar a URL.
  - `backend/src/ai-voice.js` — lê `multipart/form-data` com Busboy, transcreve com Speech‑to‑Text (`WEBM_OPUS`, `pt-BR`, `latest_long`), repassa transcrição para `analyzeMessage`.

## Frontend Refatorado
- Base da API:
  - `js/main.js:3` → `const API_BASE = 'http://localhost:8080'`.
  - `js/main.js:565-568` → `getBackendBaseUrl` usa `API_BASE` como padrão.
- Mensagens:
  - `js/main.js:1036-1047` → `enhanceMessageWithAI` faz `POST ${API_BASE}/analyze-message` com `{ text }`. Se retornar `danger` e o local não for `danger`, sobrescreve UI e adiciona CTA de BO.
- Links:
  - `js/main.js:992-1003` → `enhanceLinkWithOptionalApi` faz `POST ${API_BASE}/analyze-link` com `{ url }` e reexibe resultado com `status/summary/reasons/tips/source`.
- Voz:
  - `js/main.js:387-457` → `simulateVoice` usa `getUserMedia` + `MediaRecorder`, grava ~5s (`audio/webm`), envia via `FormData` para `${API_BASE}/analyze-voice`, exibe status e aplica fallback (SpeechRecognition ou texto padrão) se houver erro.
- Fallbacks de conexão:
  - `try/catch` silencioso mantém resultado local quando backend está offline.

## Variáveis de Ambiente (backend/.env)
- `GOOGLE_CLOUD_PROJECT_ID` — ID do projeto GCP.
- `GOOGLE_CLOUD_LOCATION` — região (ex.: `us-central1`).
- `GOOGLE_APPLICATION_CREDENTIALS` — caminho para o JSON da conta de serviço.
- Outras usadas: `VERTEX_LOCATION`, `GEMINI_MODEL`, `WEBRISK_PROJECT`, `SPEECH_LANGUAGE`, `PORT` (opcional local).

## Contratos de API
- `POST /analyze-message`
  - Request: `{ "text": "..." }`
  - Response: `{ "status": "safe|warning|danger", "summary": "...", "reasons": ["..."], "tips": ["..."] }`
- `POST /analyze-link`
  - Request: `{ "url": "..." }`
  - Response: `{ "status": "...", "summary": "...", "reasons": ["..."], "tips": ["..."], "source": "WebRisk|Gemini|Heuristics" }`
- `POST /analyze-voice`
  - Request: `multipart/form-data` com `file: Blob(audio/webm)` e `languageCode: 'pt-BR'`
  - Response: `{ "status": "...", "summary": "...", "reasons": ["..."], "tips": ["..."], "transcript": "..." }`

## Prompts (Gemini)
- Mensagens: pede análise para idosos, identifica urgência/ameaça/pedido de dinheiro/dados; resposta em JSON com chaves definidas.
- Links: busca typosquatting, marcas falsas, encurtadores e TLDs incomuns; resposta em JSON.

## Teste Local
- Backend:
  - `cd backend`
  - `npm install`
  - Definir `GOOGLE_APPLICATION_CREDENTIALS` para o JSON em `backend/credentials/...`
  - Definir `GOOGLE_CLOUD_PROJECT_ID` e `GOOGLE_CLOUD_LOCATION` em `.env`
  - `npm start` (Functions Framework expõe `http://localhost:8080`)
- Frontend:
  - Abrir `ferramentas.html` e testar “Mensagem”, “Link” e “Voz”.
  - Em erro de backend, verificação local continua operando.

## Observações
- CORS habilitado no backend.
- Sem exposição de segredos no front.
- Fallbacks garantem UX resiliente quando serviços externos não estão disponíveis.
