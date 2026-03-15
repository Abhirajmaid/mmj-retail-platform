# Billing and Inventory Dashboards

## What Changed
- Added shared workspace packages for `@jewellery-retail/api`, `@jewellery-retail/types`, and expanded `@jewellery-retail/hooks`, `@jewellery-retail/ui`, and `@jewellery-retail/utils`.
- Built shared dashboard UI primitives in `packages/ui`, including `DashboardLayout`, `Sidebar`, `Navbar`, `PageHeader`, and `StatCard`.
- Refreshed the billing and inventory visual theme using a softer premium dashboard style inspired by the provided references: floating surfaces, rounded card stacks, warmer gradients, richer sidebar treatment, and upgraded overview panels.
- Replaced the temporary sidebar initials with a reusable shared brand mark in `packages/ui` based on the storefront logo styling so `billing` and `inventory` use the same brand identity.
- Updated the shared shell again to use the provided `Primary_Logo.png` asset in both billing and inventory, shrink the sidebar brand block, remove the sidebar "Quick overview" and "Developer Team" panels, and reduce internal spacing for a denser CRM-style layout.
- Converted both app shells to a pure white background with cleaner card shadows, full-width top bars attached to the top edge, and less layered card styling so the pages match the latest reference more closely.
- Fixed the billing customers screen so clicking a customer row updates the details card on the right instead of always showing the first customer, and simplified the metric blocks there to avoid the double-layered background effect.
- Tightened the shared sidebar nav further so route items read like compact menu rows instead of large buttons, with reduced spacing, smaller icons, and lighter active-state treatment.
- Updated the billing dashboard overview hero to use the exact deep blue brand color from the logo background (`#173684`) with matching white/gold contrast accents.
- Refined sidebar alignment again so the brand block, nav rows, and sign-out action share the same horizontal rhythm and truncate cleanly in the narrower sidebar.
- Forced the billing overview hero to render as a solid brand-blue surface with no visible border by applying the background color directly and removing the card border layer.
- Increased shell depth again for visibility: stronger right-edge shadow on the sidebar, stronger bottom shadow under the top bar, and fuller all-side shadows on cards and table containers.
- Increased shell visibility once more by widening the sidebar slightly, enlarging and aligning the sidebar/top-bar brand intro text, and strengthening both the sidebar edge shadow and top-bar bottom shadow.
- Updated the inventory dashboard overview card to use the same deep blue logo background (`#173684`) so only the main overview hero carries the brand color treatment.
- Removed the extra table wrapper card treatment from the shared `Table` component so pages like inventory products/stock/purchase orders/analytics and billing invoices/payments/customers/subscriptions only show a single outer card layer and shadow.
- Added top spacing to the shared sidebar shell so the sidebar sits slightly lower from the top edge and better matches the requested visual rhythm.
- Fixed the inventory suppliers screen so clicking a supplier updates the right-hand detail panel instead of always showing the first supplier in the dataset.
- Adjusted the shared sidebar brand block again with more top spacing, larger title/subtitle text, full subtitle wrapping, and slightly slimmer nav row sizing.
- Rebuilt `apps/billing` around shared package imports with these routes:
  - `/dashboard`
  - `/invoices`
  - `/payments`
  - `/customers`
  - `/subscriptions`
  - `/reports`
- Rebuilt `apps/inventory` around shared package imports with these routes:
  - `/dashboard`
  - `/products`
  - `/stock`
  - `/suppliers`
  - `/purchase-orders`
  - `/analytics`
- Added mock-backed API fallbacks so the dashboards render even when Strapi endpoints are not yet fully connected.
- Removed older scaffolded billing and inventory routes that were outside the requested dashboard scope and were blocking production builds.

## Why
- The billing and inventory apps now follow a cleaner Turborepo separation: `apps -> hooks -> api -> backend`.
- Shared UI, hooks, types, and helper logic live in `packages/*` so both apps can scale without duplicating dashboard code.
- The new dashboards provide SaaS-style analytics, tables, filters, modal flows, and chart-driven reporting while keeping the storefront untouched.

## Setup Notes
- The apps use `NEXT_PUBLIC_STRAPI_URL` for backend connectivity.
- API functions fall back to local mock data when Strapi endpoints are unavailable, which keeps the dashboards usable during integration.
- Root `npm run dev` now focuses on the dashboard apps and excludes `mmj-web` so `billing` and `inventory` can reliably bind to `3001` and `3002`.
- Use `npm run dev:storefront` to run the storefront separately, or `npm run dev:all` if you intentionally want all frontend apps together.
- Root workspace dependencies were refreshed with `npm install`, and both `billing` and `inventory` build successfully with:
  - `npm run build --workspace=@jewellery-retail/billing-app`
  - `npm run build --workspace=@jewellery-retail/inventory-app`

## Follow-Up Notes
- Replace mock response fallbacks in `packages/api` with final Strapi collection mappings once the exact content types and response shapes are confirmed.
- If the remaining app-local `src/components` and `src/lib` files in `billing` and `inventory` are no longer needed, they can be removed in a follow-up cleanup pass.
- Billing dev-runtime stability was improved by aligning `billing` and `inventory` to React 19 and adding app-level TypeScript path resolution so shared `packages/ui` Next imports resolve against the consuming app correctly.
- If you want the references matched even more closely, the next pass can add specialized widgets such as mini action rails, wallet-style metric modules, and denser CRM-style quick action panels.
- If the top bar should exactly mirror the mock, the next pass can swap the placeholder workspace controls for live user/account data and add page-specific quick action widgets.

### Inventory dashboard search (March 2025)
- **What:** A search bar sits below the top bar and above the dashboard cards (Open purchase orders, Recent updates, etc.) on the inventory dashboard. It filters the "Recent stock updates" table by product name, SKU, or ID.
- **Why:** Lets users quickly find movements by product name, SKU, or ID without scanning the full table.
- **Where:** `apps/inventory/app/(back-office)/dashboard/page.tsx` — search state and `filteredUpdates` drive the table; the badge shows "X of Y movements" when a filter is active.
