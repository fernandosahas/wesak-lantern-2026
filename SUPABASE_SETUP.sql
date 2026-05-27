-- ═══════════════════════════════════════════════════════════════════════
-- B/Badulla Central College — Wesak Lantern Competition 2026
-- Supabase Database Setup Script
-- Run this in Supabase SQL Editor (Settings → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLES ────────────────────────────────────────────────────────────

-- Lanterns table
CREATE TABLE IF NOT EXISTS lanterns (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT          NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  team_name    TEXT          NOT NULL CHECK (char_length(team_name) BETWEEN 1 AND 100),
  description  TEXT          CHECK (char_length(description) <= 1000),
  image_url    TEXT,
  vote_count   INTEGER       NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  lantern_id   UUID          NOT NULL REFERENCES lanterns(id) ON DELETE CASCADE,
  ip_hash      TEXT          NOT NULL CHECK (char_length(ip_hash) > 0),
  device_hash  TEXT          NOT NULL CHECK (char_length(device_hash) > 0),
  fingerprint  TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Unique constraints prevent double votes
  CONSTRAINT unique_ip_hash        UNIQUE (ip_hash),
  CONSTRAINT unique_device_hash    UNIQUE (device_hash),
  CONSTRAINT unique_fingerprint    UNIQUE (fingerprint)
);

-- Settings table (single-row)
CREATE TABLE IF NOT EXISTS settings (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  voting_enabled  BOOLEAN       NOT NULL DEFAULT FALSE,
  voting_start    TIMESTAMPTZ,
  voting_end      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Insert the single settings row
INSERT INTO settings (voting_enabled) VALUES (FALSE)
  ON CONFLICT DO NOTHING;

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      TEXT          NOT NULL,
  details     JSONB,
  admin_id    TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Rate limits table (used by rate-limit.ts)
CREATE TABLE IF NOT EXISTS rate_limits (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT          NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ───────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_votes_lantern_id  ON votes(lantern_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_hash      ON votes(ip_hash);
CREATE INDEX IF NOT EXISTS idx_votes_device_hash  ON votes(device_hash);
CREATE INDEX IF NOT EXISTS idx_votes_fingerprint  ON votes(fingerprint);
CREATE INDEX IF NOT EXISTS idx_votes_created_at   ON votes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action  ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key    ON rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ts     ON rate_limits(created_at);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────

ALTER TABLE lanterns    ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Public: read-only on lanterns
CREATE POLICY "lanterns_public_select"
  ON lanterns FOR SELECT USING (true);

-- Service role: full access to everything
CREATE POLICY "lanterns_service_all"
  ON lanterns USING (auth.role() = 'service_role');

CREATE POLICY "votes_service_all"
  ON votes USING (auth.role() = 'service_role');

CREATE POLICY "settings_public_select"
  ON settings FOR SELECT USING (true);

CREATE POLICY "settings_service_all"
  ON settings USING (auth.role() = 'service_role');

CREATE POLICY "admin_logs_service_all"
  ON admin_logs USING (auth.role() = 'service_role');

CREATE POLICY "rate_limits_service_all"
  ON rate_limits USING (auth.role() = 'service_role');

-- ─── FUNCTIONS ─────────────────────────────────────────────────────────

-- Atomically increment vote count (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_vote_count(p_lantern_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE lanterns
     SET vote_count = vote_count + 1
   WHERE id = p_lantern_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lantern % not found', p_lantern_id;
  END IF;
END;
$$;

-- Auto-clean old rate limit records (run via pg_cron or manually)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '5 minutes';
END;
$$;

-- Auto-update settings.updated_at
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_timestamp();

-- ─── SAMPLE DATA (optional — remove in production) ──────────────────────
-- Uncomment to seed 12 sample lanterns for testing:

/*
INSERT INTO lanterns (name, team_name, description) VALUES
  ('Golden Lotus',        'Grade 11A',  'A magnificent golden lotus, symbol of purity and enlightenment.'),
  ('Dharma Wheel',        'Grade 11B',  'Representing the eightfold path of the Buddha.'),
  ('Bodhi Tree',          'Grade 12A',  'Under the Bodhi tree, the Buddha attained enlightenment.'),
  ('Sacred Elephant',     'Grade 12B',  'The white elephant, symbol of royal nobility.'),
  ('Flame of Peace',      'Grade 10A',  'A peaceful flame that never goes out.'),
  ('Lotus Pond',          'Grade 10B',  'A serene lotus pond at dawn.'),
  ('Moon Lantern',        'Grade 9A',   'The full moon of Wesak, shining with wisdom.'),
  ('Star Shower',         'Grade 9B',   'A thousand stars raining blessings.'),
  ('Temple Bell',         'Grade 8A',   'The ringing bell that calls all to prayer.'),
  ('River of Light',      'Grade 8B',   'A flowing river of golden light.'),
  ('Dharma Lamp',         'Grade 7A',   'The lamp of truth that illuminates all darkness.'),
  ('Sunrise Lantern',     'Grade 7B',   'Welcoming the dawn of a new era of peace.');
*/

-- ─── VERIFY SETUP ──────────────────────────────────────────────────────
SELECT 'Setup complete! Tables created: lanterns, votes, settings, admin_logs, rate_limits' AS status;
SELECT table_name, (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
  FROM information_schema.tables t
 WHERE table_schema = 'public'
   AND table_type = 'BASE TABLE'
 ORDER BY table_name;
