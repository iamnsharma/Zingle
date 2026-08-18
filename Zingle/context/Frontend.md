# Frontend — what’s done vs what we’re starting

**Product loop (must be real before store submit):**

```text
Signup → Onboarding (photos + prefs) → Swipe → Like → Match → Chat → Report/Block → Logout → Login again
```

**BaaS:** one Supabase project. Setup: [`BAAS.md`](./BAAS.md). Sprint / API contracts: [`../MVP_PLAN.md`](../MVP_PLAN.md).

---

## Where we are

| Track | Status |
|-------|--------|
| **A — Mobile UI + local loop** | **Done** (except app icon / splash) |
| **B — Supabase (live data)** | **Starting now** — you set up the project first, then we code |
| **C — TestFlight / Play** | Later, after B6 two-account test |

The app is a complete frontend dating shell. Data is still **local / mock**. Logging out and back in keeps local Zustand data; it is **not** on a server yet.

---

## Completed (Track A — frontend)

Do not rebuild these screens. Wire them to Supabase in Track B.

### Auth
- Landing, Login, Signup, Forgot Password
- Email/password validation
- Session persist on device (`authStore`)
- Logout, Delete account (wipes **local** stores)
- Google = Coming Soon
- Legal links (Terms, Privacy, Guidelines)
- PP Mori UI font; Tickerbit **only** on the “Zingle” wordmark (landing + auth headers)
- Tinder-style filled auth inputs

### Onboarding
- 7 steps: name/age (18+), gender, bio, interests, photos 1–6, city/location, review
- Gallery picker, preview, delete, reorder
- Location permission + city fallback
- Skip cannot bypass 18+, photo, or city

### Main loop
- Swipe like / pass / super like
- Reciprocal like (or super like) → **It's a Match** → Send message / Keep swiping
- Likes tab like-back; Explore like/pass
- Messages list + text thread (local echo reply)
- Report + block + blocked list
- Help, delete account, settings discovery prefs

### Store shell
- Empty states (swipe, likes, chat)
- Photo + location permission strings
- Chat `+` = Coming Soon
- Fake IAP stopped (Coming Soon)

**Not done on purpose:** app icon + splash, live APIs, Google, IAP, verification, chat photos.

---

## Starting now (Track B — BaaS)

**You first (no code):** create Supabase project, copy URL + anon key into `Zingle/.env`, enable Email auth, rebuild the app. Details: [`BAAS.md`](./BAAS.md).

**Then we implement, in order:**

| Sprint | Work | Done when |
|--------|------|-----------|
| **B1 Auth** | Live signup, login, session, forgot password, logout, delete | New email account works; mock `demo@example.com` is not required |
| **B2 Profile** | `profiles` + photo Storage | Onboarding photos persist on the server |
| **B3 Discover** | Swipes, matches, seed 20–50 profiles | Like someone who likes back → match on two accounts (or seed auto-match) |
| **B4 Chat** | Messages + Realtime | Two phones send/receive text |
| **B5 Safety** | Reports, blocks, hosted legal URLs | Block hides from feed + chat; delete removes server data |
| **B6 QA** | Two-account walkthrough | Loop in the box at the top of this file is true on real data |

---

## Explicitly not starting

Google login · IAP · selfie verification · chat attachments · Rewind · push · NestJS · extra microservices.

---

## Definition of done (ship)

A reviewer with two accounts can: create account → photos → see people → match → chat both ways → report/block → logout/login (data remains) → delete (cannot log in).

Until that is true, we are not store-ready.
