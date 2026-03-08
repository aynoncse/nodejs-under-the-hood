/**
 * utils/securityHeader.js
 *
 * Adds a collection of HTTP headers aimed at improving security.  These are a
 * minimal set; production apps should review and extend as appropriate
 * (CSP, HSTS, perms policy, etc.).
 *
 * CORS headers are also included to allow cross‑origin requests for this demo.
 */
const setSecurityHeaders = (res) => {

  res.setHeader('Access-Control-Allow-Origin', '*'); 
  
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME Sniffing
  res.setHeader('X-Frame-Options', 'DENY'); // Prevent Clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block'); // XSS Protection
};

module.exports = setSecurityHeaders;