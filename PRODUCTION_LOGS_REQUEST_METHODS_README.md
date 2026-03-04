# Production Logs – 307 Redirects & 405 Method Not Allowed (Feb 2025)

This document explains the request-method and redirect entries you may see in Vercel logs for **spsvmastery.com** / **www.spsvmastery.com**.

---

## What the logs show

| Time       | Method | Status | Host             | Path      | Meaning |
|-----------|--------|--------|------------------|-----------|---------|
| 13:56:01  | GET    | **307** | spsvmastery.com  | /api      | Redirect (e.g. to www) |
| 13:56:00  | **POST** | ---   | www.spsvmastery.com | /admin | **405** – POST not allowed |
| 13:56:00  | GET    | **307** | spsvmastery.com  | /index.php| Redirect; request for PHP file |
| 13:55:59  | **POST** | **405** | www.spsvmastery.com | /      | **405** – POST not allowed |
| 13:55:58  | GET    | **307** | spsvmastery.com  | /        | Redirect (e.g. to www) |

---

## 1. **307 Temporary Redirect** (GET on `spsvmastery.com`)

**What it is:** A **307** means “temporary redirect”: the request to the **bare domain** (`spsvmastery.com`) is being sent somewhere else (usually `www.spsvmastery.com`).

**Paths seen:** `/`, `/api`, `/index.php`

**Why it happens:**

- Your app or Vercel is set up to prefer **www** (or the opposite), so requests to the bare domain are redirected.
- `/index.php` is often from bots or scanners looking for PHP; your app is Next.js, so that request just gets redirected (or 404) and is harmless.

**Action:** None. This is normal. If you want, you can confirm in Vercel that the domain redirect (e.g. `spsvmastery.com` → `www.spsvmastery.com`) is what you expect.

---

## 2. **405 / INVALID_REQUEST_METHOD** (POST to `/` and `/admin`)

**What it is:** The client sent a **POST** request to a URL that only accepts **GET** (or other methods). The server responds with **405 Method Not Allowed** and the message:

```text
INVALID_REQUEST_METHOD: This Request was not made with an accepted method
```

**Where it comes from:** Next.js / Vercel when a route does **not** export a handler for the request method (e.g. no `POST` handler for that path).

**Why it happens:**

- **POST to `/`** – The homepage is a **page** (`src/app/page.tsx`). Pages are GET by default. Something (e.g. a bot, scanner, or misconfigured form) is POSTing to the root URL.
- **POST to `/admin`** – The admin dashboard is also a **page** (`src/app/admin/page.tsx`). It’s meant to be opened in the browser (GET). A POST to `/admin` is not supported by design.

So these 405s are **expected** when POST is used against page routes that don’t handle POST.

**Who does this:** Usually:

- Bots or security scanners probing your site.
- A form or script somewhere that incorrectly uses `action="/"` or `action="/admin"` with method POST.
- Legacy or bookmarked POST requests.

**Action:**

- **No fix required** for normal operation. Your app is correctly rejecting invalid methods.
- If you see a **real user** reporting “form doesn’t work” or “button does nothing”, check that their form posts to the correct **API route** (e.g. `/api/auth/login`) and not to `/` or `/admin`.

---

## Summary

| Log entry                          | Cause                          | Action        |
|-----------------------------------|---------------------------------|---------------|
| GET 307 on `spsvmastery.com`      | Redirect to www (or main host) | None          |
| GET 307 to `/index.php`           | Bots asking for PHP             | None          |
| POST 405 to `/` or `/admin`       | POST sent to GET-only pages    | None (or fix client form URL) |

No change is required in your app for these logs; they reflect normal redirect and method-enforcement behavior.
