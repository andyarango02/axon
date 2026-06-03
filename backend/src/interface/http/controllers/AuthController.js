'use strict';

class AuthController {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async getMe(req, res, next) {
    try {
      const { data: profile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      res.json({
        user:     req.user,
        profile:  profile ?? null,
        role:     profile?.role ?? null,
        tenantId: profile?.tenant_id ?? null,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
