const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const aiAuth = require('../middleware/aiAuth');
const aiRateLimit = require('../middleware/aiRateLimit');

// apply aiAuth middleware which only enforces when AI_PROXY_TOKEN is set
// and aiRateLimit to avoid abuse (in-memory)
// limit parser for chat endpoint to a smaller size and validate in controller
router.post('/chat', express.json({ limit: '8kb' }), aiAuth, aiRateLimit, chat);

// simple ping route to verify the AI proxy is reachable from clients
router.get('/ping', (req, res) => {
	res.json({ ok: true, ts: new Date().toISOString(), ip: req.ip });
});

// Simple status / test page served for quick browser checks
router.get('/status', (req, res) => {
	res.send(`<!doctype html>
	<html lang="fr">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<title>AI Proxy Status</title>
		<style>body{font-family:system-ui,Segoe UI,Roboto,Arial;padding:18px}button,input{padding:8px;margin:6px}pre{background:#f6f8fa;padding:12px;border-radius:6px;white-space:pre-wrap}</style>
	</head>
	<body>
		<h2>AI Proxy — Status & Test</h2>
		<p>Use this page to verify the AI proxy connectivity (ping) and to send a test message. The page now includes an explicit preflight (OPTIONS) tester and shows request/response headers to help debug CORS.</p>

		<div>
			<button id="btnPing">Ping /api/ai/ping</button>
			<pre id="pingOut">(no result)</pre>
		</div>

		<div>
			<button id="btnPreflight">Preflight (OPTIONS) /api/ai/chat</button>
			<pre id="preflightOut">(no result)</pre>
		</div>

		<hr />
		<form id="chatForm">
			<label>Message: <input id="msg" placeholder="Bonjour, je cherche ..." size="40"/></label><br/>
			<label>Client token (optional x-ai-key): <input id="token" placeholder="token" size="30"/></label><br/>
			<button type="submit">Send to /api/ai/chat (POST)</button>
		</form>
		<pre id="chatOut">(no response)</pre>

		<script>
			// Helper to show headers as object
			function headersToObj(headers){ const o={}; for(const pair of headers.entries()){ o[pair[0]] = pair[1] } return o }

			document.getElementById('btnPing').addEventListener('click', async ()=>{
				try{
					const r = await fetch('/api/ai/ping');
					const j = await r.json();
					const hdrs = headersToObj(r.headers);
					document.getElementById('pingOut').textContent = 'Response headers:\n'+JSON.stringify(hdrs, null, 2)+'\n\nBody:\n'+JSON.stringify(j, null, 2);
				}catch(e){ document.getElementById('pingOut').textContent = 'Error: '+e.message }
			});

			document.getElementById('btnPreflight').addEventListener('click', async ()=>{
				try{
					// Do an OPTIONS preflight to /api/ai/chat with the likely headers
					const r = await fetch('/api/ai/chat', { method: 'OPTIONS', headers: { 'Content-Type': 'application/json', 'x-ai-key': 'test-token' } });
					const hdrs = headersToObj(r.headers);
					document.getElementById('preflightOut').textContent = 'Status: '+r.status+'\nResponse headers:\n'+JSON.stringify(hdrs, null, 2)+'\n';
				}catch(e){ document.getElementById('preflightOut').textContent = 'Error: '+e.message }
			});

			document.getElementById('chatForm').addEventListener('submit', async (ev)=>{
				ev.preventDefault();
				const m = document.getElementById('msg').value || 'Bonjour';
				const token = document.getElementById('token').value;
				try{
					const headers = {'Content-Type':'application/json'};
					if(token) headers['x-ai-key'] = token;
					const r = await fetch('/api/ai/chat', { method: 'POST', headers, body: JSON.stringify({ message: m }) });
					const hdrs = headersToObj(r.headers);
					const txt = await r.text();
					let body;
					try{ body = JSON.parse(txt) } catch(e){ body = txt }
					document.getElementById('chatOut').textContent = 'Status: '+r.status+'\nResponse headers:\n'+JSON.stringify(hdrs, null, 2)+'\n\nBody:\n'+JSON.stringify(body, null, 2);
				}catch(e){ document.getElementById('chatOut').textContent = 'Error: '+e.message }
			});
		</script>
	</body>
	</html>`);
});

module.exports = router;
