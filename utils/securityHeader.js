const setSecurityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME Sniffing
  res.setHeader('X-Frame-Options', 'DENY'); // Prevent Clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block'); // XSS Protection
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=15552000; includeSubDomains',
  ); // HTTPS নিশ্চিত করে
};

module.exports = setSecurityHeaders;