# Database Migrations

## Quick reference

| Task | Command |
|------|---------|
| Apply migrations to **live** DB | `npm run migrate:live` |
| Create new migration (against live) | `npm run migrate:live:dev -- --name your_migration_name` |
| Apply migrations (local `.env`) | `npx prisma migrate deploy` |
| Create migration (local) | `npx prisma migrate dev --name your_migration_name` |

## Live migrations (`.env.live`)

1. Create `.env.live` with your production `DATABASE_URL` (see `.env.live.example`)
2. Run `npm run migrate:live` to apply pending migrations

`.env.live` is gitignored – never commit real credentials.

## Adding a new migration

### Option A: Against live DB

```bash
# 1. Edit prisma/schema.prisma
# 2. Run (creates migration + applies to live)
npm run migrate:live:dev -- --name add_my_feature
```

### Option B: Against local DB

```bash
# 1. Set DATABASE_URL in .env for local Postgres
# 2. Edit prisma/schema.prisma
# 3. Run
npx prisma migrate dev --name add_my_feature
```

The migration file is created in `prisma/migrations/`. Commit it and run `npm run migrate:live` when ready to apply to production.
