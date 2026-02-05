# Production Logs Analysis – Test Submission & Achievements (Feb 2025)

This document summarizes errors seen in production (www.spsvmastery.com) when students submit answers or tests, and the actions taken to fix them.

---

## Summary

- **Reported issue:** A student is not able to submit a test (assigned test).
- **Observed in logs:** Several errors appear around the same time as successful `POST /api/chapters/.../answer` (200) and related requests. The failures are logged under **`[Achievements] Failed to check achievements`** and come from the achievement-checking code that runs after saving an answer or completing a test.

So:

- The **main action** (saving an answer or submitting a test) often **succeeds** (HTTP 200).
- The **achievement/points** logic that runs afterward can **fail** and is logged as above. In some cases (e.g. DB down or pool exhausted), the whole request can fail.

---

## Errors Observed

### 1. Missing column: `points_history.studentPointsId` (Prisma P2022)

**Message:**

```text
Invalid `prisma.pointsHistory.create()` invocation:
The column `points_history.studentPointsId` does not exist in the current database.
```

**Cause:** The Prisma schema defines an optional `studentPointsId` on `PointsHistory`, but the migration that created `points_history` (`20260201140000_add_achievements_system`) did **not** add this column. So the schema and the database were out of sync.

**Impact:** Every time the app tries to create a `PointsHistory` row (e.g. when awarding points for an action or achievement), the insert fails. That happens inside `checkAchievements()`, so you see `[Achievements] Failed to check achievements` with this error.

**Fix (applied):** A new migration was added that creates the missing column and FK:

- **Migration:** `prisma/migrations/20260205000000_add_points_history_student_points_id/migration.sql`
- It adds:
  - Column: `points_history.studentPointsId` (TEXT, nullable)
  - Index: `points_history_studentPointsId_idx`
  - Foreign key: `points_history_studentPointsId_fkey` → `student_points(id)` (ON DELETE SET NULL)

**Status:** Migration has been applied to the production Neon database (Feb 2025). `pointsHistory.create()` should now succeed and achievement/points logging will work.

For other environments, apply the migration with:

```bash
DATABASE_URL='your_neon_pooler_url' npx prisma migrate deploy
```

---

### 2. Database unreachable (Prisma P1001)

**Message:**

```text
Can't reach database server at `ep-calm-river-aburmq62-pooler.eu-west-2.aws.neon.tech:5432`
Please make sure your database server is running at ...
```

**Cause:** The app could not reach the Neon Postgres instance. Common causes:

- Neon project paused (e.g. free tier auto-suspend).
- Short-lived network/connectivity issues.
- Cold start or region/network latency.

**Impact:** Any Prisma call (including inside `checkAchievements()` for `chapterProgress.findMany()`, `untimedTestAttempt.findMany()`, etc.) can fail. If this happens during the main request (e.g. saving an answer or submitting a test), the whole request can fail and the student may see an error.

**Recommendations:**

- In Neon dashboard: ensure the project is not paused; consider upgrading or adjusting auto-suspend if needed.
- Ensure `DATABASE_URL` in production points to the correct Neon host and uses the **pooler** endpoint (e.g. `-pooler` in the hostname) for serverless.
- Optionally add retries or a health check that hits the DB so you can monitor reachability.

---

### 3. Connection pool timeout (Prisma P2024)

**Message:**

```text
Timed out fetching a new connection from the connection pool.
(Current connection pool timeout: 10, connection limit: 5)
```

**Cause:** Serverless (e.g. Vercel) can create many concurrent instances. Each may open Prisma/Postgres connections. With a low connection limit (e.g. 5) and timeout 10s, if many requests need a connection at once, some will wait and can hit this timeout.

**Impact:** Requests that need the DB (including achievement checks and possibly the main submit) can fail with P2024. Students may see failed or slow submissions.

**Recommendations:**

1. **Use Neon’s pooler** in `DATABASE_URL` (e.g. `...@ep-xxx-pooler.region.aws.neon.tech:5432/...`) so connection pooling is done at Neon’s side.
2. **Limit connections per app instance** so the total across instances stays under Neon’s limit. In Vercel, set `DATABASE_URL` to your Neon pooler URL with query params, e.g. `?sslmode=require&connection_limit=2&connect_timeout=15`. Use `connection_limit=2` (or 1) for serverless to avoid pool exhaustion.
3. **Avoid holding connections longer than needed:** run achievement checks in a fire-and-forget way so the main request returns quickly. Your assigned-test submit route already uses `.catch()` for `checkAchievements`.

---

### 4. PostgreSQL connection closed

**Message:**

```text
Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Cause:** The TCP connection to Postgres was closed (by server, network, or idle timeout). Often related to:

- Neon closing idle connections.
- Long-running or queued work (e.g. achievement checks) holding a connection until it’s closed by the server.

**Recommendations:** Same as for pool timeout: use the pooler, lower `connection_limit` per instance, and keep request paths short so connections are released quickly. Ensure Prisma is not creating a long-lived connection that outlives Neon’s idle timeout.

---

## Where achievements are checked

Achievement checking runs after:

- **Chapter question answer:** `POST /api/chapters/[chapterId]/questions/[questionId]/answer`
- **Chapter complete:** `POST /api/chapters/[chapterId]/complete`
- **Untimed test complete:** `POST /api/tests/untimed/[id]/complete`
- **Assigned test submit:** `POST /api/student/assigned-tests/[id]/submit`

So any of the above errors can show up in logs for **chapter work**, **untimed tests**, or **assigned tests**. The “student not able to submit a test” for an **assigned test** can be due to:

1. **P2022** (missing column) – fix by applying the new migration.
2. **P1001** (DB unreachable) – fix by ensuring Neon is running and reachable.
3. **P2024** (pool timeout) – fix by using pooler and limiting connections per instance.
4. **Connection closed** – improve by shortening DB usage and using pooler.

---

## Checklist

- [x] **Run the new migration** in production – applied Feb 2025 via `prisma migrate deploy` with Neon pooler URL.
- [ ] **Confirm Neon** project is not paused and `DATABASE_URL` in Vercel uses the pooler host.
- [ ] **Add `connection_limit=2` and `connect_timeout=15`** to `DATABASE_URL` in Vercel (e.g. `?sslmode=require&connection_limit=2&connect_timeout=15`) to reduce P2024 pool timeouts.
- [ ] **Monitor** logs after deploy; P2022 errors should be resolved. If P1001/P2024 persist, revisit Neon and connection limits.

---

## Files touched

| File | Purpose |
|------|--------|
| `prisma/migrations/20260205000000_add_points_history_student_points_id/migration.sql` | Adds `studentPointsId` to `points_history` and FK to `student_points`. |
| `src/lib/achievements.ts` | Contains `checkAchievements()`; logs `[Achievements] Failed to check achievements` on error. |
| `src/app/api/chapters/[chapterId]/questions/[questionId]/answer/route.ts` | Calls `checkAchievements` after saving a chapter answer. |
| `src/app/api/student/assigned-tests/[id]/submit/route.ts` | Calls `checkAchievements` after assigned test submit (fire-and-forget). |

Applying the migration and tightening connection usage should resolve the missing-column errors and reduce pool/connection issues that affect test submission and achievement checks.
