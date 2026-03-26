# PostgreSQL Team Setup

## What Changed
- Switched backend default DB client to PostgreSQL in `apps/backend/config/database.ts`.
- Updated `apps/backend/.env` and `apps/backend/.env.example` to use PostgreSQL by default.
- Added `apps/backend/docker-compose.postgres.yml` for a standard local Postgres service.
- Added backend scripts:
  - `npm run db:up`
  - `npm run db:down`
  - `npm run db:logs`
- Updated backend README with PostgreSQL-first setup instructions.

## Why
- SQLite file storage is not a safe shared/team database model.
- PostgreSQL provides persistent, concurrent, team-friendly storage.
- Standardized local startup avoids repeated Strapi reset/setup issues.

## How To Use
1. From `apps/backend`, run `npm run db:up`.
2. Ensure `.env` has PostgreSQL values (already set by default).
3. Start Strapi with `npm run dev`.
4. For team sharing across machines, use a hosted/shared PostgreSQL instance and update `.env` connection values accordingly.

## Notes
- Sharing a single `data.db` file across teammates is not recommended.
- Docker volume `mmj_retail_postgres_data` keeps DB data across container restarts.
