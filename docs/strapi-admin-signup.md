# Strapi Admin: "You cannot register a new super admin"

## Why you see this

Strapi allows **only one** super admin to be created from the welcome/registration screen.  
The message **"You cannot register a new super admin"** means Strapi already has at least one super admin in the database, so it blocks creating another one from that form.

## What to do

### 1. Log in instead of signing up

If you or someone else already created an admin:

- Close the registration form and open the **Login** page (or go to `/admin` and use "Already have an account? Log in").
- Sign in with that admin’s **email** and **password**.
- If you don’t remember the password, use **Forgot password** (if available) or create a new admin via CLI (below) and then use that.

### 2. Create the first (or another) admin via CLI

From the **backend app directory** (`apps/backend`):

```bash
cd apps/backend
npx strapi admin:create-user --firstname=Admin --lastname=User --email=admin@example.com --password=YourSecurePassword123
```

Use your own first name, last name, email, and a strong password (e.g. 8+ chars, uppercase, lowercase, number).  
Then log in at `/admin` with that email and password.

### 3. Fresh start (see the registration form again)

Only do this if you want to wipe the existing admin and use the web form again (e.g. local dev):

- Stop Strapi.
- Delete or rename the SQLite DB file (e.g. `apps/backend/.tmp/data.db` if that’s where your `DATABASE_FILENAME` points).
- Start Strapi again; it will create a new DB and show the welcome/registration form for the first super admin.

**Warning:** This removes all data in that database, not just the admin user.

## Persistence fix applied in this repo

The SQLite path in `apps/backend/config/database.ts` is now resolved from the backend root (not from `dist`), so admin users and API data persist across backend restarts/rebuilds.

If you previously had data in `apps/backend/dist/.tmp/data.db`, move/copy it to `apps/backend/.tmp/data.db` once, then restart Strapi.
