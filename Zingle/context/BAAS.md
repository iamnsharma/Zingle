# BaaS — Supabase integration

**Stack:** React Native app → `src/services/api/modules/*` → **Supabase** (Auth, Postgres, Storage, Realtime).

No NestJS. No second backend. Screens must not import Supabase directly.

```text
Screens / stores
    └── src/services/api/modules/*
            └── src/config/supabase.ts
                    └── Supabase project
```

Frontend status (what’s already built locally): [`Frontend.md`](./Frontend.md). Sprint plan: [`../MVP_PLAN.md`](../MVP_PLAN.md).

---

## What the app already has (unused until keys are live)

| Piece | Path | Status |
|-------|------|--------|
| Env reader | `src/config/env.ts` | Reads `SUPABASE_URL`, `SUPABASE_ANON_KEY` via `react-native-config` |
| Client stub | `src/config/supabase.ts` | Creates JS client; session persist not fully RN-ready yet |
| Auth contract | `src/services/api/modules/auth.service.ts` | **Mock** (AsyncStorage users). Login/signup screens do not call it yet |
| Profile stub | `src/services/api/modules/profile.service.ts` | Talks to `profiles` table; unused by screens |
| Local state | `authStore`, `profileStore`, `matchStore`, `chatStore`, `safetyStore` | Dating loop works **on device only** |

Until live keys are in `.env` **and** services are wired, the app keeps using local mocks.

---

## You do this first (dashboard + keys)

Complete these before we write schema or swap mocks.

### 1. Create a Supabase project

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Name: `zingle`
3. Region: closest to you
4. Save the database password (not used in the mobile app)

### 2. Copy API keys

**Project Settings → API**

| Copy | Put in app |
|------|------------|
| Project URL `https://xxxx.supabase.co` | `SUPABASE_URL` |
| **anon public** key | `SUPABASE_ANON_KEY` |

Never put **service_role** in the app or in git.

### 3. Email auth

**Authentication → Providers → Email**

- Enable Email
- Confirm email: **off** while testing (on before store submit)
- Site URL: `zingle://`
- Redirect URL: `zingle://reset-password`

### 4. Env files in this repo

`react-native-config` loads **`.env`** in the folder that has `package.json` (`Zingle/`), not `.env.development`, unless we add `ENVFILE`.

Create **`Zingle/.env`**:

```env
NODE_ENV=development
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
API_TIMEOUT=30000
ANALYTICS_ENABLED=false
DEBUG_MODE=true
```

Also copy the same URL + anon key into `Zingle/.env.development`.

Then **native rebuild** (env is baked in; Metro reload is not enough):

```bash
yarn ios
# or
yarn android
```

### 5. Ping us

When the project exists, Email is on, `.env` is filled, and you have rebuilt — we start B1 (live auth).

---

## How we will connect the app (after setup)

| Sprint | Frontend change |
|--------|-----------------|
| **B1 Auth** | Login / Signup / Forgot / Logout / Delete call `authService` → `supabase.auth`. Session via AsyncStorage. |
| **B2 Profile** | Onboarding + Edit Profile call `profileService`. Photos upload to Storage. |
| **B3 Discover** | Swipe / Likes use `swipeService` + `GET discover` RPC instead of `MOCK_PROFILES` / `matchStore` only. |
| **B4 Chat** | `chatService` + Realtime on `messages`. Keep the same Chat UI. |
| **B5 Safety** | Report / block hit tables; discover + inbox filter blocked users server-side. |

**Rule:** add or swap modules under `src/services/api/modules/`. Do not add `supabase.from(...)` inside screens.

---

## Env variables (frontend)

| Variable | Required | Notes |
|----------|----------|--------|
| `SUPABASE_URL` | Yes | `https://<ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Public anon key |
| `NODE_ENV` | No | `development` / `production` |

Placeholder values (`your-project`, `your-anon-key`) mean **stay on mock**.

---

## Out of scope for this file

Schema SQL, RLS, buckets, seed profiles, and Edge Functions live in Track B implementation — not in this setup checklist.
