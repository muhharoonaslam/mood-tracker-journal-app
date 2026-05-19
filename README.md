# Paper & Ink — Mood Tracker Journal

A full-stack mood tracking web application built on the **Paper & Ink** design system — a Neo-Brutalist, tactile-sketching aesthetic that feels like writing in a physical notebook.

---

## Monorepo Structure

```
mood-tracker-journal-app/
├── mood-tracker-frontend/   # React 18 + Vite 5
├── mood-tracker-api/          # ASP.NET Core 8 Web API
├── summary.php              # PHP 8 admin summary page
├── docker-compose.yml       # Full-stack orchestration
└── package.json             # Root npm workspace
```

- [mood-tracker-frontend/README.md](mood-tracker-frontend/README.md)
- [mood-tracker-api/README.md](mood-tracker-api/README.md)

---

## Quick Start — Docker

```bash
git clone https://github.com/muhharoonaslam/mood-tracker-journal-app.git
cd mood-tracker-journal-app
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API + Swagger | http://localhost:8000/swagger |
| PHP Summary | http://localhost:8080 |

---

## Test Account

A test user is seeded automatically on every startup — no manual registration needed:

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `password123` |

The login page has a **"fill in"** link to pre-populate both fields with one click.

The seed is handled by `mood-tracker-api/Data/DatabaseSeeder.cs` (an `IHostedService`). It checks whether the email already exists before inserting — fully idempotent, safe across restarts and rebuilds.

To change credentials, edit `DatabaseSeeder.cs`:

```csharp
var email = "test@example.com";
BCrypt.Net.BCrypt.HashPassword("password123")
```

To force a fresh seed (wipe all data):

```bash
docker compose down -v   # removes the db-data volume
docker compose up --build
```

---

## Deployment

### Docker (Full Stack)

```bash
docker compose up --build
# or
npm run docker:up
```

### Frontend (Vercel / Netlify)

```bash
cd mood-tracker-frontend
npm run build   # outputs to dist/
```

If deploying the frontend against a separate API host, set:

```
VITE_API_URL=https://your-api-url.com
```

Deploy `dist/` to Vercel, Netlify, or any static host.

### API (Railway / Render / Azure)

```bash
cd mood-tracker-api
dotnet publish -c Release -o ./publish
```

Set on the host:

```
ConnectionStrings__DefaultConnection=Data Source=/data/mood_tracker.db
ASPNETCORE_ENVIRONMENT=Production
JwtSettings__SecretKey=<your-secret>
```

Mount a persistent volume at `/data` so SQLite survives restarts.

### PHP Summary Page

Not intended for public deployment. If needed, pass `DB_PATH` pointing to your SQLite file and run:

```bash
DB_PATH=/path/to/mood_tracker.db php -S 0.0.0.0:8080 summary.php
```

---

## Security Notes

- Passwords hashed with BCrypt (work factor 10).
- JWT signed with HMAC-SHA256, 24 h expiry.
- Login returns identical 401 for wrong email and wrong password — no enumeration.
- CORS is open (`AllowAnyOrigin`) — restrict to your frontend origin in production.
- Rotate the JWT secret and inject it as an environment variable before deploying.
- The PHP summary page has no auth — never expose port 8080 publicly.
