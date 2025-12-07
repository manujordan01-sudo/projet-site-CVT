// Simple in-memory rate limiter for AI proxy
const WINDOW_MS = 60 * 1000; // 1 minute window
const LIMIT = 30; // max requests per window per IP

const map = new Map();

module.exports = (req, res, next) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'global';
    const now = Date.now();
    let entry = map.get(ip);
    if (!entry) {
      entry = { count: 1, start: now };
      map.set(ip, entry);
      return next();
    }

    if (now - entry.start > WINDOW_MS) {
      // reset window
      entry.count = 1;
      entry.start = now;
      map.set(ip, entry);
      return next();
    }

    entry.count++;
    map.set(ip, entry);
    if (entry.count > LIMIT) {
      res.status(429).json({ error: 'Too many requests to AI proxy, slow down.' });
      return;
    }
    return next();
  } catch (err) {
    return next();
  }
};
