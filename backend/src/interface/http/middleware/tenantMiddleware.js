'use strict';

/**
 * Factory — returns an Express middleware that resolves req.tenantId from
 * the authenticated user's profile.
 *
 * - agent: tenantId is locked to user_profiles.tenant_id
 * - admin: tenantId must be supplied via ?tenantId= (can target any tenant)
 *
 * Also sets req.query.tenantId so existing controllers work without changes.
 */
function createTenantMiddleware(supabaseClient) {
  return async function tenantMiddleware(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: profile, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'User profile not found. Contact your administrator.' });
    }

    req.userRole    = profile.role;
    req.userProfile = profile;

    if (profile.role === 'admin') {
      // Admin can override tenant via query param; falls back to their own profile tenant
      req.tenantId = req.query.tenantId || req.body?.tenantId || profile.tenant_id;
      if (!req.tenantId) {
        return res.status(400).json({ error: 'tenantId is required — no default configured for this admin' });
      }
    } else {
      req.tenantId = profile.tenant_id;
    }

    next();
  };
}

module.exports = { createTenantMiddleware };
