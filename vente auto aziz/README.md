Project run instructions

Backend
- create a `.env` file in `backend/` (or copy `.env.example`) and set `MONGO_URI`, `JWT_SECRET`, `PORT`.
- From PowerShell (if `npm` is blocked by execution policy) run:

```powershell
cd "C:\Users\Hp\OneDrive\Desktop\projet site CVT\vente auto aziz\backend"
npm.cmd install
node server.js
```

If you prefer to allow normal `npm` in PowerShell, run (requires admin/user consent):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

Frontend
- From PowerShell:

```powershell
cd "C:\Users\Hp\OneDrive\Desktop\projet site CVT\vente auto aziz\frontend"
npm.cmd install
npm.cmd run dev
```

Notes
- The backend will run in degraded mode if `MONGO_URI` is missing (server stays up but DB features won't work).
- I fixed several import/casing issues and added minimal frontend components (`SearchBar`, `Pagination`, `Register`) and `index.css` to allow the app to build.

AI Assistant proxy
- You can configure a server-side OpenAI key by adding `OPENAI_API_KEY` to `backend/.env`.
- Optionally protect the proxy with a simple token: set `AI_PROXY_TOKEN` in `backend/.env`. When set, clients must send this token in the header `x-ai-key`.
- For local testing, you may set `window.AI_CLIENT_TOKEN` in the browser console to the same token value, or add a small script in `index.html` (not for production).

Example `backend/.env` additions:
```
OPENAI_API_KEY=sk-...
AI_PROXY_TOKEN=some-test-token
```

Client usage (example to set token in browser console):
```js
window.AI_CLIENT_TOKEN = 'some-test-token'
```

The chat UI calls `/api/ai/chat` which relays to OpenAI (server-side). Conversations are logged to `backend/logs/ai_conversations.log`.
