const express = require('express');
const app = express();

// Enable trust proxy to get correct client IP and protocol when behind a proxy (e.g., Heroku)
app.enable('trust proxy');

// List of known bot identifiers in User-Agent strings
const bots = [
  'facebookexternalhit',
  'facebot',
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot'
];

// Middleware to detect bots and redirect accordingly
app.use((req, res, next) => {
  // Get the User-Agent header, or default to an empty string
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';

  // Determine if the User-Agent matches any known bots
  const isBot = bots.some(bot => userAgent.includes(bot));

  // Get the protocol (http or https) correctly, even behind a proxy
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;

  // Construct the full current URL
  const currentURL = `${protocol}://${req.get('host')}${req.originalUrl}`;

  // Redirection logic
  if (isBot && currentURL !== 'https://www.napoleonpillow.org/') {
    // Redirect bots to https://www.napoleonpillow.org/
    return res.redirect(301, 'https://www.napoleonpillow.org/');
  } else if (!isBot && currentURL !== 'https://card-captain.com/') {
    // Redirect non-bots to https://cardcaptain.app/
    return res.redirect(301, 'https://card-captain.com/');
  } else {
    // If already at the correct URL, proceed to the next middleware or route handler
    next();
  }
});

// Start the server on the specified port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
