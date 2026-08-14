const crypto = require('crypto');

// Same constant-time-comparison pattern already used in
// netlify/functions/login.js — hashing first equalizes buffer length so
// crypto.timingSafeEqual (which never short-circuits) can be used safely
// even against an attacker-controlled string of arbitrary length.
function constantTimeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function requireApiKey(req, res, next) {
  const expected = process.env.ZKODE_LEADS_API_KEY;
  if (!expected) {
    res.status(500).json({ error: 'server_not_configured' });
    return;
  }
  const provided = req.get('X-API-Key') || '';
  if (!provided || !constantTimeEqual(provided, expected)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
}

module.exports = { constantTimeEqual, requireApiKey };
