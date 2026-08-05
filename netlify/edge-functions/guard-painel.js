async function hmacHex(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async (request, context) => {
  const loginUrl = new URL('/login.html', request.url);
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)zkode_session=([^;]+)/);
  if (!match) return Response.redirect(loginUrl, 302);

  const [expiresStr, sig] = decodeURIComponent(match[1]).split('.');
  const secret = Deno.env.get('ZKODE_SESSION_SECRET') || '';
  if (!secret || !expiresStr || !sig) return Response.redirect(loginUrl, 302);

  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return Response.redirect(loginUrl, 302);

  const expectedSig = await hmacHex(secret, expiresStr);
  if (expectedSig !== sig) return Response.redirect(loginUrl, 302);

  return context.next();
};

export const config = { path: '/painel.html' };
