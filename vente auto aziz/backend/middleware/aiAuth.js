const aiAuth = (req, res, next) => {
  const token = process.env.AI_PROXY_TOKEN || '';
  // If no token configured, skip auth (open but still server-side key used)
  if (!token) return next();

  // Accept either x-ai-key/x-ai-token header or Authorization: Bearer <token>
  const header = req.headers['x-ai-key'] || req.headers['x-ai-token'] || '';
  let auth = header;
  if (!auth && req.headers.authorization) {
    const m = String(req.headers.authorization).match(/^Bearer\s+(.+)$/i);
    if (m) auth = m[1];
  }

  if (!auth || auth !== token) return res.status(401).json({ error: 'Unauthorized - invalid AI proxy token' });
  next();
};

module.exports = aiAuth;
