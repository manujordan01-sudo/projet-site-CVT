const fetch = global.fetch || require('node-fetch');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required and must be a string' });

    // Trim and enforce a max length to avoid abuse / huge prompts
    const trimmed = message.trim();
    const MAX_LEN = Number(process.env.AI_MAX_MESSAGE_LENGTH) || 2000; // characters
    if (trimmed.length === 0) return res.status(400).json({ error: 'Message is empty after trimming' });
    if (trimmed.length > MAX_LEN) return res.status(413).json({ error: `Message too long (max ${MAX_LEN} characters)` });
    const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
    const logsDir = require('path').join(__dirname, '..', 'logs');
    const fs = require('fs');
    try { if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true }); } catch (e) { /* ignore */ }

    if (!OPENAI_KEY) {
      const demoReply = `Mode démo — l'assistant n'est pas connecté. Décrivez le type de voiture que vous cherchez (marque, budget, usage) et je vous donnerai des conseils.`;
      // log conversation (redact full message - store hash + truncated preview)
      try {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(trimmed).digest('hex');
        const preview = trimmed.slice(0, 200);
        const entry = { ts: new Date().toISOString(), ip: req.ip, message_preview: preview, message_hash: hash, reply: demoReply, demo: true };
        fs.appendFileSync(require('path').join(logsDir, 'ai_conversations.log'), JSON.stringify(entry) + '\n');
      } catch (e) { console.warn('Failed to write AI log', e); }
      return res.json({ demo: true, reply: demoReply });
    }

    // Allow configuring model through env; default to a widely-available model
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const payload = {
      model,
      messages: [
        { role: 'system', content: "Tu es un assistant commercial expert en vente automobile en Côte d'Ivoire. Tu aides le client à choisir une voiture selon ses goûts, son budget, son usage et l'occasion. Sois clair, courtois et propose 2-3 recommandations avec arguments." },
        { role: 'user', content: trimmed }
      ]
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: `OpenAI error ${r.status}: ${text}` });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || null;

    // log conversation (hash + preview only)
    try {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(trimmed).digest('hex');
      const preview = trimmed.slice(0, 200);
      const entry = { ts: new Date().toISOString(), ip: req.ip, message_preview: preview, message_hash: hash, reply, demo: false };
      fs.appendFileSync(require('path').join(logsDir, 'ai_conversations.log'), JSON.stringify(entry) + '\n');
    } catch (e) { console.warn('Failed to write AI log', e); }

    return res.json({ demo: false, reply });
  } catch (err) {
    console.error('AI chat error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
