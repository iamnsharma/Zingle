# Zingle MVP Plan

**Goal:** smallest real dating product that can ship to TestFlight + Play Store.

**Loop that must work with real data before store submit:**

```text
Signup → Onboarding (photos + prefs) → Swipe → Like → Match → Chat → Report/Block → Logout → Login again (data still there)
```

If that loop works, we have an MVP. Everything else is polish or later.

**Order of work:** finish remaining **mobile UI + service contracts first**. Backend is implemented second against the same contracts. Do not wait on a live API to build screens.

---

## How to use this file

- This is the only product plan. Older “complete / ready” docs describe UI, not a shippable product.
- Tick checkboxes as you finish work.
- Mobile and backend share the **API contract** section. Do not invent extra endpoints during MVP.
- Do not start Google login, verification, IAP, attachments, or algorithm work until the loop above is real.

---

## What already exists (keep)

These are built. Do not rebuild them. Wire them to real data later.

| Area | Status | Notes |
|------|--------|--------|
| Landing / Login / Signup UI | Done | Email flow is mock (`mock-token`). Google = Coming Soon. |
| Session persist | Done locally | `authStore` + AsyncStorage `zingle-auth`. Logout exists. |
| Onboarding (7 steps) | Done locally | Name, age, gender, bio, interests, photo grid UI, city list, review. |
| Swipe | Done UI | Cards, like / pass / super like, filters, boost sheet, paywall sheet. Feed is `MOCK_PROFILES`. |
| Explore / Likes / Messages / Profile / Edit | Done UI | Mock data. Chat `+` sheet is UI only. |
| Settings / Safety / Verified sheets | Done UI | Several rows are stubs (Help, Blocked, discovery pickers). |
| Liquid glass, filters, Explore, Likes tab | Keep | Premium feel. Not blockers. |
| Boost / membership / paywall UI | Keep UI | **Must not pretend purchase is real** (see Sprint M0). |
| `auth.service.ts` / `profile.service.ts` | Unused stubs | Supabase client exists; screens do not call it. |
| `Matches` screen | Built, not in tabs | Reuse for match list or fold into Chat. |

---

## What we will not build in MVP

| Feature | Why skip |
|---------|----------|
| Google login | Email is enough for v1 |
| Selfie / ID verification | Trust later; Verified sheet stays decorative or hidden |
| Chat attachments / camera | Text only |
| Rewind, deep links, push, AI | After launch |
| Real IAP / subscriptions | Free app first. UI = Coming Soon |
| Fancy matching algorithm | Same city → age → gender → exclude seen → shuffle |
| Microservices | One backend + DB + storage + realtime |

---

## Target screens (v1)

### Auth
1. Landing  
2. Login  
3. Signup  
4. Forgot Password **(new)**

### Onboarding (existing, make real)
5. Basic info (name, age)  
6. About you (gender, height)  
7. Bio  
8. Interests  
9. Photos (gallery picker, 1–6)  
10. Location  
11. Review  

### Main
12. Swipe  
13. Explore (keep, mock OK until discovery API exists)  
14. Likes  
15. Messages  
16. Chat thread  
17. Profile  
18. Edit profile  
19. Matches (wire into Chat or a simple list — do not leave orphaned)

### Safety / legal **(new or stub → real)**
20. Report  
21. Block confirm  
22. Blocked accounts  
23. Help & support  
24. Delete account  
25. Terms / Privacy / Community Guidelines (in-app WebView or hosted pages)

---

## Architecture (keep it one stack)

```text
React Native app
  └── services/*  (typed API client — mock now, live later)
        └── Backend (one service)
              ├── Auth
              ├── Profiles + photo storage
              ├── Discovery + swipes
              ├── Matches
              ├── Chat (realtime)
              └── Safety (report / block / delete)
```

**Recommended backend when we get there:** Supabase (already in the repo: Auth, Postgres, Storage, Realtime). Do not add a second backend for MVP.

**Mobile rule:** screens talk only to `src/services/api/modules/*`. Never import Supabase from a screen. That swap is how we go from mock → live without rewriting UI.

---

## API contract (mobile + backend)

Implement these and nothing else for v1. Paths can live on REST or as Supabase RPCs — names stay stable.

### Auth

| Method | Path | Body / notes |
|--------|------|----------------|
| POST | `/auth/signup` | `{ email, password, displayName }` → `{ user, token, refreshToken }` |
| POST | `/auth/login` | `{ email, password }` → `{ user, token, refreshToken }` |
| POST | `/auth/forgot-password` | `{ email }` → `{ ok: true }` (always, to avoid email enumeration) |
| POST | `/auth/logout` | Bearer token |
| DELETE | `/auth/account` | Deletes user + profile + photos + swipes + matches + messages |
| GET | `/users/me` | Current user + profile completeness |

### Profile

| Method | Path | Notes |
|--------|------|--------|
| GET | `/users/me/profile` | Full profile |
| PUT | `/users/me/profile` | Name, age, gender, bio, city, interests, prefs, photos order |
| POST | `/users/me/photos` | Multipart, 1–6 images |
| DELETE | `/users/me/photos/:id` | |
| PATCH | `/users/me/photos/reorder` | `{ photoIds: string[] }` |
| PUT | `/users/me/location` | `{ city, latitude?, longitude? }` |

### Discovery + swipes

| Method | Path | Notes |
|--------|------|--------|
| GET | `/discover` | Query: ageMin, ageMax, gender. Returns unseen profiles |
| POST | `/swipe/like` | `{ toUserId }` → `{ matched: boolean, matchId?, conversationId? }` |
| POST | `/swipe/pass` | `{ toUserId }` |
| POST | `/swipe/super-like` | `{ toUserId }` → same as like |

Server **must** persist: seen, liked, passed. Exclude those from `/discover`.

**v1 ranking:** same city → age preference → gender preference → exclude seen → randomize.

### Matches + chat

| Method | Path | Notes |
|--------|------|--------|
| GET | `/matches` | List matches |
| GET | `/conversations` | Inbox + unreadCount |
| GET | `/conversations/:id/messages` | Cursor pagination (`before`, `limit`) |
| POST | `/conversations/:id/messages` | `{ text }` text only |
| POST | `/conversations/:id/read` | Mark read |

Realtime: new message + new match events (Supabase channel or equivalent).

### Safety

| Method | Path | Notes |
|--------|------|--------|
| POST | `/reports` | `{ targetUserId, reason, details? }` reasons below |
| POST | `/blocks` | `{ targetUserId }` |
| GET | `/blocks` | Blocked list |
| DELETE | `/blocks/:userId` | Unblock |

**Report reasons:** Fake profile · Harassment · Spam · Inappropriate content · Other

After block: hide from discovery, hide profile, prevent chat both ways.

---

# Track A — Mobile first

Do this before standing up production backend. Use a **mock API module** that matches the contract (in-memory / AsyncStorage). When backend is ready, flip the client.

### Sprint M0 — Stop fake monetization (half day)

Existing paywall **fills likes as if the user paid**. That is not store-safe.

- [x] Paywall + Settings plan buttons show **Coming Soon** (no `purchasePlan` that grants inventory)
- [x] Boost purchase = Coming Soon; consuming an already-granted local boost for UI demo is OK
- [x] Super like still works against local inventory (free grant is fine)
- [x] Keep Boost / membership / liquid glass UI

Files: `PaywallBottomSheet`, `SettingsBottomSheet`, `BoostBottomSheet`, `membershipStore`

---

### Sprint M1 — Auth screens complete

**Must ship in UI (mock service OK):**

- [x] Forgot Password screen + Auth route `ForgotPassword`
- [x] Login “Forgot password?” navigates there
- [x] Email/password validation (format, min password length, required fields)
- [x] Signup validation + error states
- [x] Login / Signup call `authService` (mock implementation of the contract)
- [x] Persistent session already exists — keep it
- [x] Logout already exists — keep it
- [x] Delete Account screen (Settings → confirm → wipe local session; mock `DELETE /auth/account`)
- [x] Google buttons stay **Coming Soon** (do not implement)

New files (suggested):

- `src/screens/Auth/ForgotPasswordScreen.tsx`
- `src/screens/Settings/DeleteAccountScreen.tsx`
- `src/services/api/modules/auth.service.ts` — replace unused Supabase calls with mock that matches contract (live swap later)

---

### Sprint M2 — Profile is real on device

Onboarding UI stays. Make photos + location + save actually work locally, shaped like the API.

- [x] Gallery picker (`react-native-image-picker` or equivalent) on onboarding + Edit Profile
- [x] Select 1–6 photos, preview, delete, reorder (long-press or up/down)
- [x] Persist photo URIs locally until backend upload exists
- [x] Require at least 1 photo to finish onboarding
- [x] Name, age, gender, bio, city, interests already in wizard — persist to `profileStore`
- [x] Location: permission prompt + fallback to city list if denied
- [x] Edit Profile writes the same fields
- [x] Discovery prefs (age range, show me / gender) editable from Settings and saved

Skip: photo editor, AI quality, selfie/ID verification.

---

### Sprint M3 — Core dating loop (UI)

This is the most important missing product piece.

- [x] Like / pass / super like go through `swipeService` (mock)
- [x] Mock reciprocal like → `{ matched: true }`
- [x] **It's a Match!** modal: photos, names, **Send Message** / **Keep Swiping**
- [x] Send Message opens `ChatThread` for that match
- [x] Persist seen / liked / passed locally so cards do not repeat in-session
- [x] Likes tab reads from the same like store (not only `MOCK_LIKES`)
- [x] Wire `Matches` into Chat list (new matches appear in Messages)

Suggested: `src/components/molecules/ItsAMatchModal/`

---

### Sprint M4 — Chat (text only)

Reuse `ChatThreadScreen` / `ListScreen`.

- [x] Send text → append to thread (optimistic)
- [x] Sent / received bubbles, timestamps
- [x] Unread count on Messages tab (already has a red dot — drive it from store)
- [x] Basic pagination stub (load older = no-op or local slice)
- [x] Empty states: no matches, no messages
- [x] Attachment `+` stays visible but **Coming Soon** (do not build camera/gallery in chat)

Realtime: mock with a delayed echo or second local user later; live sockets in Track B.

---

### Sprint M5 — Trust & safety (do not skip)

Apple UGC (Guideline 1.2) and Play dating/social apps expect report + block + contact + terms.

- [x] Report sheet on profile + chat header: reason list → submit
- [x] Block: confirm → remove from feed, hide chat, add to Blocked list
- [x] Blocked accounts screen (Settings row currently closes sheet)
- [x] Help & support screen: FAQ + contact email
- [x] Terms, Privacy Policy, Community Guidelines — tappable from Landing, Signup, Settings
- [x] In-app pages or WebView to hosted URLs (hosted pages required for stores anyway)

Report reasons: Fake profile · Harassment · Spam · Inappropriate content · Other

---

### Sprint M6 — Store-ready mobile shell

- [x] Loading / empty / error states on Swipe, Likes, Chat, Profile
- [x] Permission strings: Photos, Location (iOS `Info.plist`, Android `AndroidManifest`)
- [x] Age gate: 18+ only (birth date / age already in onboarding — enforce)
- [ ] App icon + splash (replace placeholders if still default)
- [x] Crash-safe: failed login, failed upload, empty discover
- [x] Hide or disable Verified “selfie confirmed” fake checkbox (or label Coming Soon)

---

# Track B — Backend second

Start only when Track A screens exist and call the contract. Then replace mock modules with live ones.

**Stack:** one Supabase project (Auth + Postgres + Storage + Realtime). No microservices.

### Sprint B1 — Auth

- [ ] Email/password signup + login
- [ ] Session + refresh
- [ ] Forgot password email
- [ ] Logout
- [ ] Delete account (cascade profile, photos, swipes, matches, messages)
- [ ] Wire mobile `authService` to live Auth

### Sprint B2 — Profile + photos

- [ ] `profiles` table (name, age, gender, bio, city, lat/lng, interests, prefs)
- [ ] Storage bucket for photos
- [ ] Upload / delete / reorder
- [ ] Location write
- [ ] Mobile onboarding + edit hit live APIs

### Sprint B3 — Discovery + match

- [ ] `GET /discover` with stupid algorithm
- [ ] `swipes` table (like / pass / superlike, unique pair)
- [ ] On like: if reciprocal like exists → create `matches` + `conversations`
- [ ] Return `matched` on like response
- [ ] Seed **20–50 demo profiles** (photos + bios) so first users are not staring at an empty deck

### Sprint B4 — Chat

- [ ] Messages table, pagination
- [ ] Realtime insert subscription
- [ ] Unread counts
- [ ] Text only

### Sprint B5 — Safety + legal hosting

- [ ] Reports table (admin can read later; no admin UI required for v1)
- [ ] Blocks table; filter discover + chat
- [ ] Hosted Privacy Policy, Terms, Community Guidelines, Help
- [ ] **Public HTTPS account-deletion page** (Play requires this even if the app is installed)
- [ ] In-app delete actually deletes server data

### Sprint B6 — Seed + two-account test

- [ ] Create User A and User B
- [ ] A likes B, B likes A → match modal
- [ ] Chat both directions
- [ ] Report / block
- [ ] Logout / login — profile and chat persist
- [ ] Delete account — cannot login; data gone

---

# Track C — Store submission

Do this after B6, not before.

### Apple

- [ ] In-app account deletion ([Guideline 5.1.1(v)](https://developer.apple.com/support/offering-account-deletion-in-your-app/)) — not email-only
- [ ] Privacy Policy URL in App Store Connect **and** in-app
- [ ] UGC: filter/report, block users, contact, published EULA ([Guideline 1.2](https://developer.apple.com/app-store/review/guidelines/))
- [ ] 17+ / 18+ rating; dating is an established category — product must feel complete (real loop, not a shell)
- [ ] Photo + location purpose strings
- [ ] No fake IAP
- [ ] Support URL with a real contact method ([Guideline 1.5](https://developer.apple.com/app-store/review/guidelines/))

### Google Play

- [ ] In-app account deletion **and** public web deletion URL ([Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111))
- [ ] Data safety form matches what the app actually collects
- [ ] Privacy Policy in Play Console and in-app
- [ ] Photos / location permissions declared and used
- [ ] UGC / dating policies: report + block + 18+

### Builds

- [ ] iOS TestFlight internal
- [ ] Android Play internal testing
- [ ] Production signing, icons, screenshots, description

---

## Suggested calendar (mobile → backend → store)

| Week | Focus | Done when |
|------|--------|-----------|
| 1 | M0 + M1 + M2 | Auth + photos + location work on device (mock API) |
| 2 | M3 + M4 + M5 | Match modal, text chat, report/block/help/legal |
| 3 | M6 + B1 + B2 | Store shell + live auth + live profile |
| 4 | B3 + B4 + seed | Real discover / like / match / chat |
| 5 | B5 + B6 + C | Safety live, two-user QA, TestFlight + Play internal |

Slip is fine. **Do not** insert Google / IAP / verification into this calendar.

---

## Definition of done (ship)

A reviewer (or you with two phones) can:

1. Create a new account with email  
2. Finish onboarding with real photos  
3. See seeded (or other test) profiles  
4. Like someone who likes back  
5. See It's a Match  
6. Send and receive a text  
7. Report and block  
8. Log out and log in — data remains  
9. Delete account — cannot log in again  

Until that is true, we are not store-ready.

---

## File map (where work goes)

| Work | Where |
|------|--------|
| Auth screens | `src/screens/Auth/` + `src/navigation/AuthStack/` |
| Onboarding | `src/screens/Onboarding/` |
| Swipe | `src/screens/Home/SwipeScreen.tsx` |
| Chat | `src/screens/Chat/` |
| Settings / safety | `src/components/molecules/SettingsBottomSheet/` + new screens |
| API contract | `src/services/api/endpoints.ts` + `src/services/api/modules/` |
| Mock data (temporary) | `src/services/mock/` — remove from screens once services own data |
| Session | `src/stores/authStore.ts` |
| Profile | `src/stores/profileStore.ts` |
| Matches / likes | `src/stores/matchStore.ts` |
| Chat | `src/stores/chatStore.ts` |

---

## Explicit non-goals until after launch

Google login · Vision Camera verification · Onfido/Persona · chat attachments · Rewind · IAP · subscriptions · push notifications · deep links · AI matching · admin dashboard · microservices.

Keep the UI for Boost, Super Like, membership, Explore, filters, liquid glass. Do not let them block the loop.
