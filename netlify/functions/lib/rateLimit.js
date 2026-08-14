// Shared per-IP rate limiter for Netlify Functions, backed by Netlify Blobs.
// Lives in lib/ (not directly in netlify/functions/) so Netlify's function
// discovery doesn't try to publish this file as its own endpoint.
const { getStore } = require('@netlify/blobs');

function getClientIp(event) {
  var headers = event.headers || {};
  var forwardedFor = (headers['x-forwarded-for'] || '').split(',')[0].trim();
  return headers['x-nf-client-connection-ip'] || headers['client-ip'] || forwardedFor || 'unknown';
}

// Fixed-window counter per (bucket, ip). Fails open on storage errors — a
// Blobs hiccup should never lock real users out or crash the request.
async function checkRateLimit(event, bucket, limit, windowMs) {
  var ip = getClientIp(event);
  var key = bucket + ':' + ip;
  var now = Date.now();
  var entry = null;

  try {
    var store = getStore('rate-limits');
    entry = await store.get(key, { type: 'json', consistency: 'strong' });
    if (!entry || typeof entry.windowStart !== 'number' || now - entry.windowStart > windowMs) {
      entry = { count: 0, windowStart: now };
    }
    entry.count += 1;
    await store.setJSON(key, entry);
  } catch (err) {
    // Storage unavailable — allow the request through rather than blocking
    // legitimate traffic because of an infrastructure issue.
    console.error('rate limit storage error:', err);
    return { allowed: true, ip: ip };
  }

  var allowed = entry.count <= limit;
  var retryAfterSeconds = Math.max(1, Math.ceil((entry.windowStart + windowMs - now) / 1000));
  return { allowed: allowed, retryAfterSeconds: retryAfterSeconds, ip: ip };
}

module.exports = { checkRateLimit: checkRateLimit, getClientIp: getClientIp };
