// In-memory fixed-window rate limiter, keyed by IP.
//
// This is safe here (unlike the Netlify Functions version in
// netlify/functions/lib/rateLimit.js, which needed Netlify Blobs) because
// this backend runs as a single long-running Node process under iisnode —
// there's no cold-start/multi-instance state-sharing problem to solve.
const buckets = new Map();

function checkRateLimit(ip, limit, windowMs) {
  const now = Date.now();
  let entry = buckets.get(ip);
  if (!entry || now - entry.windowStart > windowMs) {
    entry = { count: 0, windowStart: now };
  }
  entry.count += 1;
  buckets.set(ip, entry);

  // Occasional cleanup so the map doesn't grow unbounded under sustained traffic.
  if (buckets.size > 5000) {
    for (const [key, val] of buckets) {
      if (now - val.windowStart > windowMs) buckets.delete(key);
    }
  }

  const allowed = entry.count <= limit;
  const retryAfterSeconds = Math.max(1, Math.ceil((entry.windowStart + windowMs - now) / 1000));
  return { allowed, retryAfterSeconds };
}

module.exports = { checkRateLimit };
