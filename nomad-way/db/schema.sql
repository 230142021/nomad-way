-- Nomad Way — PostgreSQL schema
-- Run: psql "$DATABASE_URL" -f db/schema.sql   (or: npm run db:init)

CREATE TABLE IF NOT EXISTS destinations (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(80)  NOT NULL UNIQUE,
  name_en         VARCHAR(200) NOT NULL,
  name_ru         VARCHAR(200) NOT NULL,
  short_en        TEXT         NOT NULL DEFAULT '',
  short_ru        TEXT         NOT NULL DEFAULT '',
  description_en  TEXT         NOT NULL DEFAULT '',
  description_ru  TEXT         NOT NULL DEFAULT '',
  region          VARCHAR(30)  NOT NULL,
  categories      TEXT[]       NOT NULL DEFAULT '{}',
  seasons         TEXT[]       NOT NULL DEFAULT '{}',
  difficulty      VARCHAR(20)  NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  scene           VARCHAR(20)  NOT NULL DEFAULT 'mountain',
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  featured        BOOLEAN      NOT NULL DEFAULT FALSE,
  activities      TEXT[]       NOT NULL DEFAULT '{}',
  tips_en         TEXT[]       NOT NULL DEFAULT '{}',
  tips_ru         TEXT[]       NOT NULL DEFAULT '{}',
  images          TEXT[]       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations (region);
CREATE INDEX IF NOT EXISTS idx_destinations_categories ON destinations USING GIN (categories);

-- Predefined route templates used by the Trip Planner
CREATE TABLE IF NOT EXISTS route_templates (
  id          VARCHAR(80) PRIMARY KEY,
  position    INTEGER     NOT NULL DEFAULT 0,
  duration    VARCHAR(10) NOT NULL CHECK (duration IN ('1-3', '4-7', '8-14', '14+')),
  data        JSONB       NOT NULL,           -- title, summary, interests, start, stops
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  subject     VARCHAR(150) NOT NULL DEFAULT '',
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id             SERIAL PRIMARY KEY,
  username       VARCHAR(60)  NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,       -- scrypt: salt:hash (hex)
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
