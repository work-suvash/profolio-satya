# Satya Raj Editing Portfolio

A Next.js 15 personal portfolio website for a video/content editor with a fully-featured hidden admin panel.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **AI**: Google Genkit AI integration (Gemini 2.5 Flash)
- **Backend/DB**: Supabase (PostgreSQL + Storage)
- **Language**: TypeScript

## Project Structure

- `src/app/` — Next.js App Router pages and layouts
  - `(root)/` — Public portfolio page
  - `admin/` — Hidden admin panel (accessible only via direct URL `/admin`)
  - `api/admin/login/` — Password-based admin auth endpoint
- `src/components/` — UI components
  - `sections/` — Portfolio sections (Hero, Skills, About, Creative Edits, Contact)
  - `admin/` — Admin panel tabs (Dashboard, Messages, Hero, Services, About, Projects)
  - `layout/` — Header, Footer, ClientLayout
  - `ui/` — shadcn/ui primitives
- `src/lib/supabase/` — Supabase client, admin helpers, stats tracking
- `src/ai/` — Genkit AI flows and configuration
- `src/hooks/` — Custom React hooks

## Admin Panel

Access at `/admin` — not linked anywhere on the public site.

Default password: `admin123` (set via ADMIN_PASSWORD env var)

### Admin Tabs
- **Dashboard** — Overview stats (messages, projects, services, views, likes)
- **Messages** — View/delete contact form submissions from the Hire Me form
- **Hero & Profile** — Profile picture, name, tagline, stats (Experiences/Projects/Rating), CV upload, social media links
- **Services** — Add/edit/delete services with icon, title, description, thumbnail, link
- **About** — Photo management with zoom/position controls, bio, title, subtitle
- **Projects** — Add/edit/delete projects with image/video upload, live link, view comments

## Database Tables (Supabase)

- `projects` — Portfolio projects (title, desc, category, type, thumbnail, src, live_link, views, likes)
- `services` — Services offered (icon_name, title, description, thumbnail, link, sort_order)
- `site_settings` — Key/value store for hero and about section settings
- `contact_messages` — Messages from the Hire Me contact form
- `project_comments` — User comments on projects
- `project_stats` — View and like counts per project

## Environment Variables

Set as Replit secrets:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `ADMIN_PASSWORD` — Admin panel password (default: admin123)
- `GOOGLE_GENAI_API_KEY` — For AI features (optional)

## Running the App

```
npm run dev
```

Dev server runs on port 5000 bound to 0.0.0.0. Installed with `--legacy-peer-deps`.

## Replit Migration Notes

- Package manager: npm (`package-lock.json`).
- App location: project root.
- Workflow command: `npm run dev`.
- Replit preview runs on port 5000 bound to `0.0.0.0`.
- Admin login no longer returns the configured admin password to the browser.
