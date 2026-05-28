# CAPEX — Deployment & Setup Handoff

> Hand this whole file to a fresh agent (Claude Cowork) or follow it yourself.
> It assumes **no prior context**. Goal: get the CAPEX web app live on Vercel
> with a Supabase backend, and the Claude Code plugin syncing savings into it.

---

## 0. Overview — what these projects are

CAPEX is two repos that work together:

| Repo | Path | GitHub | Role |
|------|------|--------|------|
| **Plugin** | `~/capex-plugin` | `github.com/ozkilim/capex-plugin` | A Claude Code plugin. Replaces built-in file tools with token-efficient MCP tools (`Search`/`Edit`/`Read`/`Write`), tracks estimated savings locally in `~/.capex/`, and (when linked) pushes savings to the web app. |
| **Web app** | `~/Documents/capex` | `github.com/ozkilim/capex` | Next.js 16 marketing site + dashboard. Users sign in, generate a personal access token (PAT), and see their savings. |

**How they connect:**
```
User signs in (Supabase Auth) on the web app
  -> Dashboard > Token: POST /api/tokens  mints a hashed PAT (cpx_sk_...)
In Claude Code:  /capex-login --token cpx_sk_...   (stores it in ~/.capex/auth.json)
After each CAPEX tool call: plugin POSTs lifetime totals to
  POST /api/telemetry/savings  (Authorization: Bearer cpx_sk_...)
Dashboard > Savings: GET /api/savings  sums the user's rows and renders them
```

**Important honesty note:** savings are *heuristic estimates*, not measured
spend. The sync sends only aggregate counters + a random machine id (no code,
paths, or prompts) — but it does leave the machine, which contradicts the
current landing-page line “everything stays on your developers' machines.”
Reword that copy (see Section 7).

---

## 1. Current status (already done — do NOT redo)

- Web app backend code is written and pushed (`github.com/ozkilim/capex`, branch `main`):
  - Supabase clients: `src/lib/supabase/{client,server,admin}.ts`
  - Auth swapped to Supabase in `src/lib/auth.tsx` (+ `src/app/auth/callback/route.ts`, `src/middleware.ts`)
  - API routes: `src/app/api/tokens/route.ts`, `src/app/api/tokens/[id]/route.ts`, `src/app/api/telemetry/savings/route.ts`, `src/app/api/savings/route.ts`
  - Schema: `supabase/migrations/0001_init.sql`
  - Token + Savings dashboard pages wired to real data
  - `.env.local.example` template committed; `tsc --noEmit` passes
- Plugin code is written and pushed (`github.com/ozkilim/capex-plugin`, branch `main`):
  - `scripts/capex-cli.js`, `scripts/sync.js`, `src/remote.js`, `skills/capex-login/SKILL.md`
  - `scripts/tracking-hook.js` fires a detached sync when linked. All 36 tests pass.

**What's NOT done (this runbook):** create the Supabase project, run the
migration, configure auth providers, deploy to Vercel, set env vars, set the
plugin's production API URL.

---

## 2. Prerequisites (human must provide / approve)

An agent cannot create third-party accounts or approve billing. The human needs:
- A **Supabase** account (free tier is fine): https://supabase.com
- A **Vercel** account linked to the `ozkilim` GitHub: https://vercel.com
- (Optional, for Google login) A **Google Cloud OAuth client** (client id + secret)
- CLI tools (agent may install): `npm i -g supabase` and `npm i -g vercel` (or use the dashboards)

If doing it by agent: prefer the **dashboards** for account-scoped actions and
use CLIs only after the human has logged them in (`supabase login`, `vercel login`).

---

## 3. Part A — Supabase

1. **Create project**: Supabase dashboard -> New project. Pick a region near
   your users. Save the database password.
2. **Run the schema**: open SQL Editor -> paste the full contents of
   `~/Documents/capex/supabase/migrations/0001_init.sql` -> Run.
   (CLI alternative: `supabase link --project-ref <ref>` then `supabase db push`.)
   This creates `api_tokens` and `savings` with Row Level Security.
3. **Grab API keys**: Project Settings -> API. Copy:
   - Project URL  -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY` (SECRET — server only)
4. **Auth settings** (Authentication -> URL Configuration):
   - **Site URL**: your production URL (e.g. `https://capex.vercel.app` or custom domain)
   - **Redirect URLs** (add all):
     - `http://localhost:3000/auth/callback`
     - `https://<your-prod-domain>/auth/callback`
5. **Email auth**: Authentication -> Providers -> Email = enabled. For quick
   testing, you may disable “Confirm email”; for production configure SMTP.
6. **Google auth (optional)**: Providers -> Google = enabled. Paste the Google
   OAuth client id + secret. In Google Cloud console, set the authorized
   redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`.

---

## 4. Part B — Vercel

1. **Import** `github.com/ozkilim/capex` into Vercel (New Project -> import). It
   auto-detects Next.js; no build settings needed.
2. **Environment Variables** (Project Settings -> Environment Variables) — add
   for Production (and Preview if desired):
   ```
   NEXT_PUBLIC_SUPABASE_URL       = https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = <anon key>
   SUPABASE_SERVICE_ROLE_KEY      = <service_role key>   (mark as sensitive)
   ```
3. **Deploy.** Note the resulting URL (e.g. `https://capex.vercel.app`).
4. **Go back to Supabase** (Part A.4) and make sure that exact URL is the Site
   URL and that `<url>/auth/callback` is in the redirect allow-list.
5. (Optional) Add a **custom domain** in Vercel; if you do, update Supabase URL
   config + the plugin default URL (Part C) to match.

---

## 5. Part C — Point the plugin at production

The CLI currently defaults to `http://localhost:3000`. For a real install,
users either pass `--url` / set `CAPEX_API_URL`, OR you hardcode the prod URL:

1. Edit `~/capex-plugin/src/remote.js`:
   ```js
   export const DEFAULT_API_URL = process.env.CAPEX_API_URL || "https://<your-prod-domain>";
   ```
2. Commit + push the plugin repo. (Do NOT add a `Co-Authored-By: WOZCODE`
   trailer — the owner removed that attribution from history.)
3. Users update with `/plugin` (or reinstall) to get the new default.

---

## 6. Part D — End-to-end verification

1. Visit the prod URL, sign in (Google or email).
2. Dashboard -> **Token / Connect** -> **Generate token** -> copy `cpx_sk_...`.
3. In Claude Code (CAPEX plugin installed + active `capex:code` agent):
   ```
   /capex-login --token cpx_sk_...        # add --url https://<prod> if not hardcoded
   ```
   Expect: “Linked this machine …”.
4. Ask Claude to do a file search so a `mcp__plugin_capex_code__Search` runs.
5. Reload Dashboard -> **Savings**. Numbers should appear (summed per machine).
6. Spot-check in Supabase: Table editor -> `savings` has a row for your user;
   `api_tokens.last_used_at` updated.

If savings don't appear: check the Vercel function logs for
`/api/telemetry/savings` (401 = bad/replaced token; 500 = check service-role
key / RLS), and confirm `~/.capex/auth.json` has the right `apiUrl`.

---

## 7. Decisions / open items for the human

- **Landing copy**: reword “everything stays on your developers' machines” —
  opt-in sync now exists. Be explicit it's opt-in and only aggregates.
- **Savings honesty**: keep the “est.” labeling everywhere; consider a
  tooltip explaining the heuristic constants (`~/capex-plugin/src/savings-model.js`).
- **Billing model**: token savings only mean $ on usage-based API billing, not
  flat Max/Pro plans. Decide how the dashboard frames this.
- **Token UX**: currently multiple PATs allowed; “generate new” doesn't revoke
  old ones (revoke is manual). Decide if regenerate should auto-revoke.
- **Security**: service-role key must never reach the browser (it doesn't —
  only used in API routes). PATs are stored as SHA-256 hashes.

---

## 8. What to do next (product roadmap)

Come back to the main coding session for these:
- Hardcode prod URL in the plugin + ship a `/plugin` update.
- Dashboard polish: real trend chart from time-series (today `savings` is a
  rollup; add a `savings_events` append table if you want graphs over time).
- `/capex-logout` skill + a “Last synced” indicator on the dashboard.
- Rate-limit `/api/telemetry/savings`; add a simple per-token request cap.
- Tests for the API routes (currently only plugin-side is unit-tested).
