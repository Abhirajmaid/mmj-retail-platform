# Firm Backend Integration

## What

The Firm add/edit/list flow is connected to the Strapi backend. Firms are stored in the database and loaded/saved via the inventory app API routes.

## 503 when adding a firm

If **POST /api/firms** returns **503 (Service Unavailable)** or you see "Backend not configured" in the UI:

1. **Inventory app** (port 3002) must have Strapi URL and (optionally) token set:
   - Copy `apps/inventory/.env.example` to `apps/inventory/.env.local`.
   - Set `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` (no trailing slash).
   - Set `STRAPI_API_TOKEN` to a token from Strapi Admin → Settings → API Tokens (needed for create/update/delete).
2. **Strapi backend** must be running (e.g. `npm run dev` in `apps/backend` so it listens on 1337).

Until then, the app still adds firms **in memory** (up to 2) so you can use the form; they are not persisted to the database until the backend is connected.

## Backend (Strapi)

- **Content type**: `api::firm.firm` in `apps/backend/src/api/firm/`
- **Schema**: `content-types/firm/schema.json` — fields aligned with `Firm` in `apps/inventory/src/types/firm.ts`
- **Endpoints**: CRUD at `/api/firms` and `/api/firms/:id` (after Strapi restart)
- **Permissions**: `firm` was added to `erpCollections` in `apps/backend/src/index.ts` so the authenticated role gets find/findOne/create/update/delete

**After adding the firm API**, restart the Strapi server so the new content-type is registered.

## Inventory app

- **API routes**: `apps/inventory/app/api/firms/route.ts` (GET list, POST create) and `apps/inventory/app/api/firms/[id]/route.ts` (GET one, PUT update, DELETE). They proxy to Strapi using `NEXT_PUBLIC_STRAPI_URL` and `STRAPI_API_TOKEN`.
- **Client**: `apps/inventory/src/lib/api/firms.ts` — `fetchFirms`, `fetchFirm`, `createFirm`, `updateFirm`, `deleteFirm`
- **Store**: `apps/inventory/src/store/firm-store.ts` — uses the API for all operations; falls back to in-memory create when the backend is not configured (503) so the app still works without Strapi

## Env

- `NEXT_PUBLIC_STRAPI_URL` — Strapi base URL (e.g. `http://localhost:1337`)
- `STRAPI_API_TOKEN` — API token from Strapi Admin → Settings → API Tokens (needed for create/update/delete; optional for read if permissions allow public)

## Behaviour

- **List**: On opening `/firm`, the app calls `GET /api/firms` and shows loading then the list (or an error).
- **Add**: Submit on add form calls `POST /api/firms`; on success redirects to `/firm`, on error shows message and keeps the form.
- **Edit**: Opening `/firm/edit/[id]` loads the firm via `GET /api/firms/:id` if not already in the store; save calls `PUT /api/firms/:id`.
- **Delete**: Delete action calls `DELETE /api/firms/:id`; list updates on success, error is shown at top of the list.

