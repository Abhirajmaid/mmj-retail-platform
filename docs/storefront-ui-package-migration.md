# Storefront UI Package Migration

## What Changed
- Replaced the existing `packages/ui` component surface with shared storefront-oriented primitives and reusable navigation pieces.
- Moved shared UI responsibilities for `Button`, `Input`, `Label`, `DropdownMenu`, `Form`, `Tooltip`, `Divider`, `SectionTitle`, `ComingSoon`, `Loader`, `SingleLink`, `PaginationControls`, `Navlinks`, and `SideNavbar` into `packages/ui`.
- Updated `storefront` to consume `@jewellery-retail/ui` instead of local duplicates and removed the old duplicated files from `apps/storefront/src/components/ui`, `apps/storefront/src/components/common`, and `apps/storefront/src/components/Dashboard`.
- Added `@jewellery-retail/ui` as a workspace dependency in `apps/storefront` and enabled `transpilePackages` in `apps/storefront/next.config.mjs`.

## Why
- Centralizes reusable UI into the shared package so multiple apps can consume the same primitives and navigation components.
- Removes duplicated storefront UI code and makes `packages/ui` the single source of truth for shared presentation components.

## Setup Notes
- `npm install` was run at the workspace root to sync the new shared package dependencies and update the lockfile.

## Follow-Up Notes
- `npm run lint --workspace apps/storefront` currently fails because `next lint` is passing deprecated ESLint CLI options in this repo setup. The UI migration itself did not surface editor lint errors in the touched files.
- `npm run build --workspace apps/storefront` now compiles the migrated package code, but the app still fails during prerendering for `/404` and `/500` because of an existing React/runtime issue in the current workspace setup.
