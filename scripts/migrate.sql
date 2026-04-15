-- Migration script: create all tables required by the app
-- Run this against your Supabase project via the SQL editor or psql.

-- projects
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT 'Newly Added',
  type        text NOT NULL DEFAULT 'image',
  thumbnail   text NOT NULL DEFAULT '',
  src         text NOT NULL DEFAULT '',
  live_link   text,
  views       integer NOT NULL DEFAULT 0,
  likes       integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- project_stats
CREATE TABLE IF NOT EXISTS public.project_stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  views      integer NOT NULL DEFAULT 0,
  likes      integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id)
);

-- project_comments
CREATE TABLE IF NOT EXISTS public.project_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author     text NOT NULL DEFAULT 'Anonymous',
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- services
CREATE TABLE IF NOT EXISTS public.services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name   text NOT NULL DEFAULT '',
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  thumbnail   text NOT NULL DEFAULT '',
  link        text NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name  text NOT NULL DEFAULT '',
  phone      text NOT NULL DEFAULT '',
  service    text NOT NULL DEFAULT '',
  message    text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- site_settings (key-value store for hero, about, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
