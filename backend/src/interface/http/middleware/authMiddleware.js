'use strict';

/**
 * Factory — returns an Express middleware that validates the Supabase JWT
 * in the Authorization header and attaches req.user = { id, email }.
 */
function createAuthMiddleware(supabaseClient) {
  return async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = header.slice(7);

    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  };
}

module.exports = { createAuthMiddleware };
