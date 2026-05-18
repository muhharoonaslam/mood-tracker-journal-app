# Paper & Ink — Mood Tracker Journal

A full-stack mood tracking web application with a warm, paper-and-ink journal aesthetic. Users register, log their mood (Happy, Neutral, Sad) with an optional note, and view their recent mood history on a horizontally scrollable timeline.

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
| Styling | Plain CSS (Paper & Ink theme) |
| Faces | HTML Canvas (no SVG/emoji/images) |
| Bonus | PHP 8 summary page |
| Containers | Docker + Docker Compose |

---

## Quick Start (Docker)

The fastest way to run everything locally:

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
- PHP 8+ with `pdo_sqlite` extension (optional, for summary page)

### 1. Run the API

```bash
cd MoodTrackerApi
dotnet run
```

The API starts on `http://localhost:5000`. Swagger UI is at `http://localhost:5000/swagger`.

SQLite database (`mood_tracker.db`) is created automatically on first run inside the `MoodTrackerApi/` directory.

### 2. Run the React Frontend

```bash
cd mood-tracker-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. API calls are proxied to `http://localhost:5000` via Vite's dev proxy.

### 3. Run the PHP Summary Page (optional)

```bash
# From repo root — requires the API to have run at least once
php -S localhost:8080 summary.php
```

Open `http://localhost:8080`.

---

## API Design

Base URL: `http://localhost:5000`

### Authentication Endpoints

#### `POST /api/auth/register`

Register a new account.

**Request body:**
```json
{ "email": "user@example.com", "password": "Password123!" }
```

**Responses:**
| Status | Meaning |
|--------|---------|
| 201 | Account created |
| 400 | Validation error |
| 409 | Email already in use |

---

#### `POST /api/auth/login`

Login and receive a JWT.

**Request body:**
```json
{ "email": "user@example.com", "password": "Password123!" }
```

**Response (200):**
```json
{ "token": "eyJhbGci..." }
```

---

### Mood Endpoints

All mood endpoints require `Authorization: Bearer <token>`.

#### `POST /api/moods`

Log a new mood entry.

**Request body:**
```json
{ "moodType": "Happy", "note": "Had a great day." }
```

**Response (201):**
```json
{
  "id": 1,
  "moodType": "Happy",
  "timestampUtc": "2026-05-19T10:30:00Z",
  "note": "Had a great day."
}
```

**Validation:**
- `moodType` required, must be `Happy`, `Neutral`, or `Sad` (case-sensitive)
- `note` optional, max 300 characters

---

#### `GET /api/moods/recent`

Fetch the 7 most recent mood entries for the logged-in user.

**Response (200):**
```json
[
  { "id": 3, "moodType": "Neutral", "timestampUtc": "...", "note": null },
  { "id": 2, "moodType": "Happy",   "timestampUtc": "...", "note": "Productive!" }
]
```

Entries are sorted **newest first**. Returns an empty array if no entries exist.

---

## Entity Framework Core & Database

### Schema

**Users table:**

| Column | Type | Notes |
|--------|------|-------|
| Id | INTEGER (PK) | Auto-increment |
| Email | TEXT | Unique index |
| PasswordHash | TEXT | BCrypt hash |
| CreatedAtUtc | TEXT | ISO-8601 UTC |

**MoodEntries table:**

| Column | Type | Notes |
|--------|------|-------|
| Id | INTEGER (PK) | Auto-increment |
| UserId | INTEGER (FK) | References Users.Id |
| MoodType | TEXT | Happy / Neutral / Sad |
| TimestampUtc | TEXT | ISO-8601 UTC |
| Note | TEXT | Nullable |

### EF Core Setup

The project uses `Database.EnsureCreated()` on startup — no migration files needed. The SQLite file is created at `MoodTrackerApi/mood_tracker.db` (or at the path configured in `ConnectionStrings:DefaultConnection`).

To run a code-first migration instead:

```bash
cd MoodTrackerApi
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Auth Flow

1. Client calls `POST /api/auth/register` or `/login`.
2. On login, API validates credentials (BCrypt), then issues a signed JWT containing `userId` and `email` claims.
3. Client stores the token in `localStorage`.
4. All subsequent mood requests include `Authorization: Bearer <token>`.
5. ASP.NET Core's JWT middleware validates the token and populates `HttpContext.User`.
6. Controllers extract `UserId` from `ClaimTypes.NameIdentifier`.

JWT settings (secret key, issuer, expiry) live in `appsettings.json` under `JwtSettings`.

---

## React Structure & State Management

```
src/
  api/
    authApi.js       # register(), login()
    moodsApi.js      # getRecent(), createMood()
  components/
    LoginForm.jsx    # "Welcome Back" auth form
    RegisterForm.jsx # "Begin Your Journal" auth form
    MoodSelector.jsx # Three canvas-face mood buttons
    MoodCanvasFace.jsx # Canvas-only face renderer
    MoodForm.jsx     # Selector + note textarea + submit
    MoodTimeline.jsx # Horizontal scroll container
    TimelineEntry.jsx # Individual journal card with click animation
    ErrorMessage.jsx # Inline error display
    LoadingState.jsx # Animated loading dots
  hooks/
    useAuth.js       # token, user, login(), register(), logout()
    useMoods.js      # entries, loading, error, fetchEntries(), submitMood()
  App.jsx            # Root — auth gate + layout
  main.jsx
```

**State lives in:**
- `useAuth` — JWT token (persisted in `localStorage`), decoded user email
- `useMoods` — entries array, loading/submitting flags, error string
- `App` — `activeEntryId` (which timeline card was last clicked), `showRegister` toggle, `authError`

No Redux, no routing library — everything is plain React state.

---

## Canvas Mood Faces

HTML Canvas was chosen because it satisfies the "no SVG, no emoji, no images, no icon fonts" requirement while keeping the drawing code self-contained and portable.

Every `MoodCanvasFace` uses a `useRef`/`useEffect` pair. On mount (or when `mood`/`size` changes) it:

1. Sizes the canvas for HiDPI screens using `window.devicePixelRatio`.
2. Draws a filled circle (face background) with a colored stroke ring.
3. Draws two dot eyes, adjusting position per mood.
4. Draws the mouth using `ctx.arc()`:
   - **Happy** — upward arc (`0.15π` to `0.85π`) + warm blush circles
   - **Neutral** — a straight horizontal line with `moveTo`/`lineTo`
   - **Sad** — downward arc (`1.15π` to `1.85π`) + angled eyebrows via `lineTo`

When `animated={true}` (selected mood in the picker), an `requestAnimationFrame` loop adds a gentle vertical float using `Math.sin(t * 0.002) * 1.5`.

**Mood color mapping:**

| Mood | Color | Hex |
|------|-------|-----|
| Happy | Warm amber | `#E8913A` |
| Neutral | Sage green | `#7A8B69` |
| Sad | Muted blue | `#6B8CAE` |

---

## PHP Summary Page

`summary.php` (in the repo root) connects to the same `mood_tracker.db` SQLite file used by the .NET API:

```php
$pdo = new PDO('sqlite:' . __DIR__ . '/MoodTrackerApi/mood_tracker.db');
```

It queries all mood entries joined to users and renders them in an HTML table with colour-coded mood badges. The page is entirely server-rendered — no JavaScript.

**To run locally:**
```bash
# From repo root (requires the .NET API to have run at least once)
php -S localhost:8080 summary.php
```

**Columns displayed:** ID, User ID, Email, Mood, Timestamp UTC, Note

The PHP page is not deployed separately — it can be run locally or via Docker (see `docker-compose.yml` `php-summary` service).

---

## Deployment

### Frontend (Vercel / Netlify)

```bash
cd mood-tracker-frontend
npm run build   # outputs to dist/
```

Set environment variable:
```
VITE_API_URL=https://your-api-url.com
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

### API (Railway / Render / Azure)

```bash
cd MoodTrackerApi
dotnet publish -c Release -o ./publish
```

Set environment variables on the host:
```
ConnectionStrings__DefaultConnection=Data Source=/data/mood_tracker.db
ASPNETCORE_ENVIRONMENT=Production
```

Mount a persistent volume at `/data` so the SQLite file survives restarts.

### Docker (Full Stack)

```bash
docker-compose up --build
```

The `docker-compose.yml` defines three services:
- `api` — .NET API on port 5000, SQLite stored in a named volume
- `frontend` — React app served by nginx on port 3000, proxies `/api/*` to the API container
- `php-summary` — PHP built-in server on port 8080

---

## Validation Rules

### Register
- `email` — required, valid email format
- `password` — required, minimum 6 characters
- Duplicate email → 409 Conflict

### Login
- `email` — required
- `password` — required
- Wrong credentials → 401 Unauthorized (identical response for wrong email or wrong password)

### Mood Entry
- `moodType` — required, must be exactly `Happy`, `Neutral`, or `Sad`
- `note` — optional, max 300 characters
- No valid JWT → 401 Unauthorized

---

## With More Time

With more time I would add mood analytics — a weekly trend chart showing mood frequency over time using Canvas-drawn bar or line graphs — so users can identify patterns like "I'm usually Sad on Mondays" and gain more meaningful insight from their journal data.

---

## Security Notes

- Passwords are hashed with BCrypt (work factor 10).
- JWT tokens are signed with HMAC-SHA256 and expire after 24 hours.
- The login endpoint returns an identical 401 for both "user not found" and "wrong password" to prevent email enumeration.
- CORS is open (`AllowAnyOrigin`) — tighten to the deployed frontend domain in production.
- The JWT secret key in `appsettings.json` should be rotated and stored as a secret/environment variable in production.
