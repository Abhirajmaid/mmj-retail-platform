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
- `FeaturedSec` now switches between `newIns` and `bestSeller` using the product `feature` field, so the home page tabs no longer show the same cards.
- `products.js` now includes five dedicated `newIns` mock items so the `New Ins` tab always renders a full set with distinct SKUs and prices.
- `ProductCard` now calculates display price during render instead of effect cleanup, preventing inconsistent values in the product carousel.
- The product details page now fills `You May Like This` with up to four related items ranked by matching category and feature instead of rendering the home page featured carousel there.
- Jewellery nav submenus and listing filters now use real product types from the current mock catalogue instead of hardcoded options that had no matching items.
- The jewellery header count and pagination now use the current filtered result set instead of a fixed number or the unfiltered catalogue size.

## Follow-up
- Optional cleanup: remove `axios` from storefront dependencies if no longer used anywhere.
- Optional: replace remaining action wrappers with direct data imports where desired.
