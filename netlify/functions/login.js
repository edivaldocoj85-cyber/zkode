const crypto = require('crypto');

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };
  }

  let email = '';
  let password = '';
  try {
    const body = JSON.parse(event.body || '{}');
    email = String(body.email || '').trim().toLowerCase();
    password = String(body.password || '');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'invalid_body' }) };
  }

  const ADMIN_EMAIL = String(process.env.ZKODE_ADMIN_EMAIL || '').trim().toLowerCase();
  const ADMIN_PASSWORD = String(process.env.ZKODE_ADMIN_PASSWORD || '');
  const SECRET = String(process.env.ZKODE_SESSION_SECRET || '');

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SECRET) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'server_not_configured' }) };
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'invalid_credentials' }) };
  }

  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const payload = String(expires);
  const token = payload + '.' + sign(payload, SECRET);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `zkode_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`
    },
    body: JSON.stringify({ ok: true })
  };
};
