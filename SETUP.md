# CAPEX backend setup

This wires the web app to a Supabase backend and lets the Claude Code plugin
sync per-user savings into the dashboard.

## 1. Create a Supabase project

1. Create a project at https://supabase.com.
2. Project Settings -> API. Copy: Project URL, `anon` public key, `service_role` key.
3. Enable the Google provider under Authentication -> Providers (optional but
   recommended). Add your site URL and `https://<your-domain>/auth/callback`
   (and `http://localhost:3000/auth/callback` for local dev) to the redirect
   allow-list.

## 2. Run the schema

In the Supabase SQL editor, paste and run `supabase/migrations/0001_init.sql`.
This creates `api_tokens` and `savings` with Row Level Security.

## 3. Configure env

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # server-only, never exposed
```

For production (Vercel), set the same three as Environment Variables.

## 4. Run / deploy

```bash
npm install
npm run dev      # http://localhost:3000
```

## 5. Link the Claude Code plugin

1. In the app, sign in and open **Dashboard -> Token / Connect**.
2. Click **Generate token** and copy the `cpx_sk_...` value (shown once).
3. In Claude Code (with the CAPEX plugin installed):
   ```
   /capex-login --token cpx_sk_...
   ```
   For a non-production app URL, pass `--url`:
   `/capex-login --token cpx_sk_... --url http://localhost:3000`
   (or set `CAPEX_API_URL` in the environment).
4. Use Claude Code normally. After each CAPEX tool call the plugin pushes your
   cumulative lifetime totals to `POST /api/telemetry/savings`.
5. Refresh **Dashboard -> Savings** — your numbers appear, summed across any
   machines you've linked.

## How it fits together

```
browser login (Supabase Auth)
   -> POST /api/tokens         mints a hashed PAT for the user
Claude Code: /capex-login      stores token in ~/.capex/auth.json
tracking-hook (per tool call)  spawns sync.js (detached)
   -> POST /api/telemetry/savings  (Bearer cpx_sk_...)  upserts savings row
Dashboard -> GET /api/savings  sums the user's rows
```

## Notes / honesty

- Savings figures are **heuristic estimates** (see the plugin's
  `src/savings-model.js`), not measured spend.
- Syncing sends those estimates off the developer's machine to your backend.
  Only the aggregate counters + a random machine id are sent — no file
  contents, paths, or prompts. Update your marketing copy ("everything stays on
  your machine") to reflect that opt-in sync exists.
- Tokens are stored only as SHA-256 hashes; the plaintext is shown once.
