# Storefront Mock Data Migration

## What Changed
- Removed backend/API dependency from `apps/storefront/src/lib/action/*.action.js`.
- Replaced Strapi/axios calls with local mock responses backed by data in `apps/storefront/src/data/`.
- Added dedicated mock data modules:
  - `products.js`
  - `categories.js`
  - `users.js`
  - `collections.js`
  - `hero.js`
  - `metalRates.js`
  - `notifications.js`
- Updated `ContactForm` to persist messages to local storage instead of calling `/api/contact`.
- Added compatibility exports in `apps/storefront/src/data/data.js` so existing imports continue to work.

## Why
- The monorepo storefront runs without a backend service, so all data access must be local.
- Keeping Strapi-shaped mock responses preserves existing UI component behavior with minimal rendering changes.

## Runtime Notes
- Authentication and subscribers are now mock/local-storage based in `user.action.js` and `subscriber.action.js`.
- Metal rate updates now mutate in-memory mock state and are reflected in UI during runtime.
- `robots.js` now has a safe fallback for `NEXT_PUBLIC_BASE_URL` to avoid env-only setup requirements.

## Follow-up
- Optional cleanup: remove `axios` from storefront dependencies if no longer used anywhere.
- Optional: replace remaining action wrappers with direct data imports where desired.
