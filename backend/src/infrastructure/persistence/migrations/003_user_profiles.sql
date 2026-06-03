-- ============================================================
-- USER PROFILES
-- Links Supabase Auth users to tenants and roles.
-- auth.users is managed by Supabase; this table extends it.
-- ============================================================

CREATE TABLE user_profiles (
  id         UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id  UUID         REFERENCES tenants(id),   -- NULL for global admins
  role       VARCHAR(20)  NOT NULL DEFAULT 'agent', -- 'admin' | 'agent'
  full_name  VARCHAR(255),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED: after running this migration, create users via
-- Supabase Dashboard → Authentication → Users, then insert
-- their profile rows:
--
-- INSERT INTO user_profiles (id, tenant_id, role, full_name)
-- VALUES (
--   '<auth.users uuid>',
--   '<tenants uuid>',   -- or NULL for admin
--   'agent',            -- or 'admin'
--   'Nombre Apellido'
-- );
-- ============================================================
