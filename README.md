# Paper & Ink — Mood Tracker Journal

A full-stack mood tracking web application built on the **Paper & Ink** design system — a Neo-Brutalist, tactile-sketching aesthetic that feels like writing in a physical notebook.

Users register, log their mood (Happy / Neutral / Sad) with an optional note, and review their recent history on a scrollable timeline. The app adapts its entire layout between mobile and desktop — bottom-nav + FAB on mobile, persistent sidebar + multi-column grid on desktop.

---

## Live URLs

| Service | URL |
|---------|-----|
| React frontend | _Deploy to Vercel/Netlify — see Deployment section_ |
| .NET API | _Deploy to Railway/Render — see Deployment section_ |
| PHP Summary | _Run locally — see PHP section_ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | SQLite |
| Auth | JWT (Bearer tokens) |
| Frontend | React 18 + Vite 5 |
| Styling | Plain CSS — Paper & Ink design system |
| Drawing | HTML Canvas — mood faces, tally marks, bar chart |
| Bonus | PHP 8 summary page |
| Containers | Docker + Docker Compose |

---

## Quick Start (Docker)

```bash
git clone https://github.com/muhharoonaslam/mood-tracker-journal-app.git
cd mood-tracker-journal-app
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API + Swagger | http://localhost:5000/swagger |
| PHP Summary | http://localhost:8080 |

---

## Manual Local Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- PHP 8+ with `pdo_sqlite` extension (optional)

### 1. Run the API

```bash
cd MoodTrackerApi
dotnet run
```

Starts on `http://localhost:5000`. Swagger UI at `http://localhost:5000/swagger`.
`mood_tracker.db` is created automatically on first run.

### 2. Run the React Frontend

```bash
cd mood-tracker-frontend
npm install
npm run dev
```

Starts at `http://localhost:5173`. API calls proxy to `http://localhost:5000` via Vite.

### 3. Run the PHP Summary Page (optional)

```bash
php -S localhost:8080 summary.php
```

---

## API Design

Base URL: `http://localhost:5000`

### Auth Endpoints

#### `POST /api/auth/register`

```json
// Request
{ "email": "user@example.com", "password": "Password123!" }

// 201 Created
{ "message": "Account created successfully." }
```

| Status | Meaning |
|--------|---------|
| 201 | Account created |
| 400 | Validation error |
| 409 | Email already in use |

#### `POST /api/auth/login`

```json
// Request
{ "email": "user@example.com", "password": "Password123!" }

// 200 OK
{ "token": "eyJhbGci..." }
```

| Status | Meaning |
|--------|---------|
| 200 | Token returned |
| 400 | Missing fields |
| 401 | Wrong credentials |

### Mood Endpoints

All require `Authorization: Bearer <token>`.

#### `POST /api/moods`

```json
// Request
{ "moodType": "Happy", "note": "Had a great day." }

// 201 Created
{
  "id": 1,
  "moodType": "Happy",
  "timestampUtc": "2026-05-19T10:30:00Z",
  "note": "Had a great day."
}
```

Validation:
- `moodType` required, must be exactly `Happy`, `Neutral`, or `Sad`
- `note` optional, max 300 characters

#### `GET /api/moods/recent`

Returns the logged-in user's last 7 entries, newest first.

```json
[
  { "id": 7, "moodType": "Neutral", "timestampUtc": "...", "note": "Quiet day." },
  { "id": 6, "moodType": "Happy",   "timestampUtc": "...", "note": "Productive!" }
]
```

Returns `[]` if no entries exist.

---

## Entity Framework Core & Database

### Schema

**Users**

| Column | Type | Notes |
|--------|------|-------|
| Id | INTEGER PK | Auto-increment |
| Email | TEXT | Unique index |
| PasswordHash | TEXT | BCrypt hash |
| CreatedAtUtc | TEXT | ISO-8601 UTC |

**MoodEntries**

| Column | Type | Notes |
|--------|------|-------|
| Id | INTEGER PK | Auto-increment |
| UserId | INTEGER FK | → Users.Id |
| MoodType | TEXT | Happy / Neutral / Sad |
| TimestampUtc | TEXT | ISO-8601 UTC |
| Note | TEXT | Nullable |

### Setup

`Database.EnsureCreated()` runs on startup — no migration files are needed. The SQLite file is created at `MoodTrackerApi/mood_tracker.db`.

To use EF migrations instead:

```bash
cd MoodTrackerApi
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Auth Flow

1. Client posts to `/api/auth/register` or `/api/auth/login`.
2. On login, BCrypt verifies the password. A signed JWT is returned containing `userId` and `email` claims (24 h expiry, HMAC-SHA256).
3. The frontend stores the token in `localStorage` and decodes the email claim client-side for display.
4. Every mood request includes `Authorization: Bearer <token>`.
5. ASP.NET Core's JWT middleware populates `HttpContext.User`. Controllers read `UserId` from `ClaimTypes.NameIdentifier`.
6. The login endpoint returns an identical 401 for "user not found" and "wrong password" — no email enumeration.

JWT settings live in `appsettings.json → JwtSettings`. Rotate the secret key and inject it as an environment variable in production.

---

## Design System — Paper & Ink

The UI follows a **Neo-Brutalism + Tactile Sketching** philosophy: high-contrast ink-on-paper visuals, irregular shapes, and hard-edged shadows. Every element should feel hand-drawn on quality stationery.

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface` | `#fcf9f1` | Main background (moleskine cream) |
| `--aged-paper` | `#F0EAD6` | Cards and secondary surfaces |
| `--ink` | `#1A1A1A` | Borders, text, shadows |
| `--terracotta` | `#E9A390` | Active states, streak card, today's bar |
| `--graphite` | `#7A7567` | Muted text, timestamps, grid lines |
| `--error-red` | `#D32F2F` | Validation errors |

Mood accent colors:

| Mood | Hex |
|------|-----|
| Happy | `#E8913A` (warm amber) |
| Neutral | `#7A8B69` (sage green) |
| Sad | `#6B8CAE` (muted blue) |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headings, buttons, labels | **Cabin Sketch** | 700 |
| Body, inputs, notes | **Architects Daughter** | 400 |

Both loaded from Google Fonts in `index.html`.

### Shape & Depth Rules

- **Border radius:** `3px 5px 2px 4px` — irregular corners for a hand-drawn feel
- **Borders:** `2px solid #1A1A1A` on every card, button, and input container
- **Hard shadow:** `4px 4px 0px #1A1A1A` on all elevated elements
- **Press interaction:** shadow removes and element shifts `translate(2px, 2px)` on `:active`
- **Background:** dot grid via `radial-gradient(circle, rgba(122,117,103,0.35) 1px, transparent 1px)` at 20 px spacing
- **Ruled lines:** `repeating-linear-gradient` at 28 px for note areas and textareas

---

## React Structure & State Management

```
src/
  api/
    authApi.js            # register(), login()
    moodsApi.js           # getRecent(), createMood()

  components/
    LoginForm.jsx         # "My Journal / Unlock" auth page
    RegisterForm.jsx      # "Begin your ledger" auth page
    MoodCanvasFace.jsx    # Wobbly bezier canvas face (Happy/Neutral/Sad)
    MoodSelector.jsx      # Three mood-card picker
    MoodForm.jsx          # Date stamp + mood picker + ruled textarea + "Ink it"
    MoodTimeline.jsx      # Horizontal scroll (mobile) / grid (desktop) container
    TimelineEntry.jsx     # Rotated aged-paper card with click pulse animation
    StreakCard.jsx        # Terracotta card — consecutive journaling days
    ReflectionsTrend.jsx  # Canvas bar chart — entries per weekday
    SummaryView.jsx       # Month in Review — tally cards + daily ledger
    TallyMarks.jsx        # Canvas-drawn tally strokes (4 vertical + diagonal cross)
    BottomNav.jsx         # Mobile-only fixed bottom nav (Journal / Log / Summary)
    DesktopSidebar.jsx    # Desktop-only sidebar — nav + inline mood form + user
    ErrorMessage.jsx      # Red-ink inline error
    LoadingState.jsx      # Handwritten-style loading text

  hooks/
    useAuth.js            # token, user, login(), register(), logout()
    useMoods.js           # entries, loading, error, fetchEntries(), submitMood()

  App.jsx                 # Auth gate + view router + useIsDesktop hook
  main.jsx
```

### App Views (state: `view`)

| Value | What renders |
|-------|-------------|
| `'timeline'` | Recent Entries cards + Reflections Trend chart + Streak card |
| `'log'` | Full-screen mood entry form (mobile only — form is in sidebar on desktop) |
| `'summary'` | Month in Review with tally cards + Daily Ledger |

### State

| Location | State | Purpose |
|----------|-------|---------|
| `useAuth` | `token`, `user` | JWT persisted in `localStorage` |
| `useMoods` | `entries`, `loading`, `submitting`, `error` | API data + request states |
| `App` | `view`, `activeEntryId`, `showRegister`, `authError` | Navigation + UI state |
| `App` | `isDesktop` (via `useIsDesktop`) | `window.matchMedia('(min-width: 768px)')` listener |

No Redux, no routing library.

### Mobile vs Desktop Layout

| | Mobile `< 768px` | Desktop `≥ 768px` |
|---|---|---|
| Navigation | Fixed bottom tab bar | Left sidebar (300 px) |
| Mood form | Full-screen view via FAB | Always visible in sidebar |
| Timeline | Horizontal snap-scroll cards | CSS `auto-fill` grid |
| Widgets | Stacked below timeline | Sticky right column (280 px) |
| FAB | Visible | Hidden |

---

## Canvas Mood Faces

HTML Canvas is used for all mood faces to satisfy the "no SVG, no emoji, no images, no icon fonts" requirement.

`MoodCanvasFace.jsx` uses `useRef` + `useEffect`. On mount or prop change it:

1. Scales the canvas for HiDPI via `window.devicePixelRatio`.
2. Draws an **irregular wobbly circle** outline using 8 quadratic bezier curves with baked-in offsets — not a perfect `ctx.arc` — to simulate a hand-drawn stroke.
3. Fills the face with aged-paper (`#F0EAD6`).
4. Draws two dot eyes; sad faces add angled eyebrows via `lineTo`.
5. Draws the mouth:
   - **Happy** — upward `ctx.arc` + two blush circles
   - **Neutral** — straight `moveTo`/`lineTo`
   - **Sad** — downward `ctx.arc`
6. When `animated={true}` (selected in the mood picker), a `requestAnimationFrame` loop adds a gentle vertical float via `Math.sin(t * 0.002) * 1.5 px`.

No SVG, no emoji, no images, no icon fonts are used for mood faces.

---

## Canvas Tally Marks

`TallyMarks.jsx` draws proper tally mark groups on canvas — 4 vertical strokes + 1 diagonal cross stroke per group of 5. It accepts `count`, `color`, and `height` props, scales for HiDPI, and renders `—` for zero.

Used in:
- **Summary tally cards** — one per mood, colored in the mood's accent color
- **Daily Ledger rows** — showing how many entries were logged that day

This avoids unreliable unicode combining characters and renders consistently across all browsers and fonts.

---

## Canvas Bar Chart (Reflections Trend)

`ReflectionsTrend.jsx` draws a weekly bar chart (Mon–Sun) on canvas:

- Counts entries from the `entries` array per day of the week
- Today's bar is rendered in **terracotta**; all others in **ink black**
- Shadow drawn before the bar (not after), avoiding the "shadow on top" bug
- Uses a `ResizeObserver` on a wrapper `<div>` to read the real container width — solves the `canvas.offsetWidth === 0` problem on first render
- Redraws on any container resize (sidebar toggle, window resize, orientation change)

---

## Streak Card

`StreakCard.jsx` calculates the current consecutive journaling streak from the entries array:

1. Extracts unique calendar dates (UTC) from entries, sorted newest first.
2. Checks that the most recent date is today or yesterday (otherwise streak = 0).
3. Walks backward through dates, counting consecutive days with a 1-day gap.

Displayed in a terracotta card with a large `Cabin Sketch` number and a rotating motivational quote.

---

## Month in Review (Summary View)

`SummaryView.jsx` shows two sections:

**Tally Cards** — one per mood, filtered to the current calendar month:
- Canvas mood face
- Mood name in its accent color
- Canvas-drawn tally marks (`TallyMarks`)
- Numeric count

**Daily Ledger** — all-time entries grouped by calendar day (one row per day):
- Date (e.g. "May 18, 2026" — full year, not `'2-digit'`)
- Dominant mood for that day (colored in accent)
- Canvas tally marks for the number of entries that day

A "Most felt this month" stat bar at the top highlights the leading mood with its accent color.

---

## PHP Summary Page

`summary.php` reads directly from the same `mood_tracker.db` file used by the .NET API:

```php
$pdo = new PDO('sqlite:' . __DIR__ . '/MoodTrackerApi/mood_tracker.db');
```

It joins `MoodEntries` to `Users` and renders all entries in a styled HTML table. No JavaScript, no separate database.

**Columns:** ID, User ID, Email, Mood, Timestamp UTC, Note

**To run:**
```bash
# From repo root — API must have run at least once to create the DB
php -S localhost:8080 summary.php
```

Available via Docker at `http://localhost:8080` (see `docker-compose.yml`).

---

## Validation Rules

### Register
- `email` — required, valid email format
- `password` — required, minimum 6 characters
- Duplicate email → 409 Conflict

### Login
- `email` — required
- `password` — required
- Wrong credentials → 401 (identical message for wrong email or wrong password)

### Mood Entry
- `moodType` — required, must be exactly `Happy`, `Neutral`, or `Sad`
- `note` — optional, max 300 characters
- No valid JWT → 401 Unauthorized

---

## Deployment

### Frontend (Vercel / Netlify)

```bash
cd mood-tracker-frontend
npm run build   # outputs to dist/
```

Set env var: `VITE_API_URL=https://your-api-url.com`

Deploy `dist/` to Vercel, Netlify, or any static host.

### API (Railway / Render / Azure)

```bash
cd MoodTrackerApi
dotnet publish -c Release -o ./publish
```

Set on the host:
```
ConnectionStrings__DefaultConnection=Data Source=/data/mood_tracker.db
ASPNETCORE_ENVIRONMENT=Production
```

Mount a persistent volume at `/data` so SQLite survives restarts.

### Docker (Full Stack)

```bash
docker-compose up --build
```

Three services:
- `api` — .NET 8 API on port 5000, SQLite in a named Docker volume
- `frontend` — React served by nginx on port 3000, proxies `/api/*` to the API
- `php-summary` — PHP built-in server on port 8080, mounts the same volume

---

## With More Time

With more time I would add **export and sharing** — letting users download their mood history as a PDF journal page (rendered with Canvas in the same Paper & Ink aesthetic) or share a single entry as an image. This fits naturally with the tactile, handwritten feel of the design and gives the journaling experience a tangible, shareable output beyond the screen.

---

## Security Notes

- Passwords hashed with BCrypt (work factor 10).
- JWT signed with HMAC-SHA256, 24 h expiry.
- Login returns identical 401 for wrong email and wrong password — no enumeration.
- CORS is open (`AllowAnyOrigin`) for development. Restrict to the deployed frontend origin in production.
- Rotate the JWT secret in `appsettings.json` and inject it as an environment variable before deploying.
