# Firm API – Strapi response mapping

## What changed

- **List and single-firm API routes** (`/api/firms` and `/api/firms/[id]`) now support both Strapi response shapes when mapping to the `Firm` type:
  - **Strapi v4 (nested):** `{ id, attributes: { firmId, shopName, email, ... } }`
  - **Strapi v5 / flat:** `{ id, firmId, shopName, email, ... }` (no `attributes`)

- If `entry.attributes` exists and is an object, the mapper uses it; otherwise it uses the `entry` itself so flattened responses still populate company name, primary contact, REG NO, GSTIN, etc.

## Why

- The backend is Strapi v5, which returns a **flattened** format (fields at the top level of each `data` item).
- The inventory app was only reading from `entry.attributes`, which is undefined in v5, so only fields with fallback defaults (e.g. `status`, `firmType`) appeared in the table; name, email, phone, registrationNo, gstinNo did not.

## Where

- `apps/inventory/app/api/firms/route.ts` – `mapStrapiToFirm` in GET (and POST response).
- `apps/inventory/app/api/firms/[id]/route.ts` – `mapStrapiToFirm` in GET and PUT.

## Strapi v5 documentId (edit/update/delete)

- In Strapi v5, single-document routes use **documentId** (string), not numeric **id**: `GET/PUT/DELETE /api/firms/:documentId`.
- The list and single-firm mappers now set `Firm.id` from `documentId` when present, so the edit page and update/delete calls use the correct identifier and no longer get 404 from Strapi.

## Follow-up

- No migration or env changes required. Reload the firm list (or edit page) to see full firm data in the table and forms. Edit and update should work once firms are loaded with documentId as id.
