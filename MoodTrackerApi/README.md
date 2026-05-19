# MoodTrackerApi

Part of the [mood-tracker-journal-app](../README.md) monorepo.

## Run locally

Requires [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

```bash
cd MoodTrackerApi
dotnet run
```

- API at `http://localhost:5000`
- Swagger UI at `http://localhost:5000/swagger`
- Database (`mood_tracker.db`) and test user are created automatically on first run

**Test account:** `test@example.com` / `password123`

## Docker

```bash
# From repo root
docker compose up --build
```

API available at `http://localhost:5000`.
