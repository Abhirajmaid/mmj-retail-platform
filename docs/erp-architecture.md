# Jewellery ERP Architecture

## What Changed

This document covers the full ERP system scaffold added to the mmj-retail-platform Turborepo.

---

## Apps

| App | Port | Purpose |
|---|---|---|
| `apps/backend` | 1337 | Strapi v5 REST + GraphQL API |
| `apps/billing` | 3001 | POS terminal + CRM (new) |
| `apps/inventory` | 3002 | Back office + manufacturing (new) |
| `apps/storefront` | 3000 | Ecommerce storefront (existing) |

---

## Packages

| Package | Purpose |
|---|---|
| `@jewellery-retail/ui` | Shared Radix/shadcn UI components |
| `@jewellery-retail/billing` | Billing math: GST, making charges, invoice totals, old gold exchange |
| `@jewellery-retail/inventory-core` | Stock CRUD helpers against Strapi API |
| `@jewellery-retail/crm-core` | Customer ledger and history helpers |
| `@jewellery-retail/reports-core` | Sales and stock analytics aggregators |

---

## Strapi Backend — Content Types

### Extended (existing types updated)

| Type | New Fields |
|---|---|
| `category` | `metal_type` (gold/silver/diamond/platinum/other) |
| `product` | `design_number`, `metal_type`, relation to `jewellery-item` |
| `customer` | `mobile`, `city`, `pincode`, `pan_number`, `aadhaar_number`, `loyalty_points`, `credit_limit`, `notes`, relations to `sale`, `custom-order`, `repair`, `saving-scheme` |
| `supplier` | `mobile`, `gst`, `city`, relations to `purchase-order`, `stone` |

### New Content Types (16 total)

**Business:** `store`

**Inventory:** `jewellery-item`

**Stones:** `stone`, `stone-inventory`

**Purchase:** `purchase-order`, `purchase-item`

**Sales:** `sale`, `sale-item`, `payment`

**Orders:** `custom-order`

**Repairs:** `repair`

**Manufacturing:** `manufacturing-order`, `karigar`

**Finance:** `expense`, `ledger-entry`

**Schemes:** `saving-scheme`

---

## Lifecycle Hooks (Auto-Sync)

`apps/backend/src/api/sale/content-types/sale/lifecycles.ts`
- After a sale is created: creates a `ledger-entry` for the customer and adds loyalty points (+1 per ₹1000 spent).

`apps/backend/src/api/sale-item/content-types/sale-item/lifecycles.ts`
- After a sale item is created: automatically marks the linked `jewellery-item` status as `"sold"`.

---

## Billing App (POS) — Routes

| Route | Purpose |
|---|---|
| `/dashboard` | KPIs: today's sales, gold rates, pending orders |
| `/billing` | POS terminal (barcode scan, cart, checkout) |
| `/billing/[invoiceId]` | Invoice view and print |
| `/customers` | Customer list with search |
| `/customers/new` | Create new customer |
| `/customers/[id]` | Customer profile, ledger, history |
| `/orders` | Custom order management |
| `/orders/new` | Create custom order |
| `/repairs` | Repair job tracking |
| `/repairs/new` | Receive repair job |
| `/schemes` | Saving scheme management |
| `/schemes/new` | Enrol customer in scheme |
| `/reports` | Daily sales, category, salesperson reports |

### POS Sale Formula

```
Gold Value      = weight × gold_rate × (purity / 24)
Making Charge   = per gram / per piece / % of gold value
Stone Cost      = stone weight × stone rate
GST on Metal    = (Gold Value + Making) × 3%
GST on Stone    = Stone Cost × 18%
Net Payable     = Gold Value + Making + Stone + GST - Old Gold Exchange - Discount
```

---

## Inventory App (Back Office) — Routes

| Route | Purpose |
|---|---|
| `/dashboard` | Stock value, low stock, mfg orders |
| `/catalog/products` | Product catalogue |
| `/catalog/categories` | Category management |
| `/catalog/designs` | Design library |
| `/stock` | Current stock grid |
| `/stock/inward` | Receive new stock |
| `/stock/transfer` | Store-to-store transfer |
| `/stock/adjustment` | Manual status adjustment |
| `/stock/audit` | Physical stock audit |
| `/barcode` | Generate and print barcode tags |
| `/manufacturing` | Manufacturing orders list |
| `/manufacturing/new` | Create manufacturing order |
| `/manufacturing/finished` | Receive finished goods from karigar |
| `/karigar` | Karigar directory |
| `/karigar/[id]` | Karigar profile + labour ledger |
| `/purchase` | Purchase orders |
| `/purchase/suppliers` | Supplier management |
| `/melting` | Old gold intake and melting log |
| `/melting/refine` | Refining records |
| `/reports` | Stock, category, dead stock, fast-moving |

---

## API Flow: POS Sale (End-to-End)

```
1. Scan barcode → GET /api/jewellery-items?filters[barcode][$eq]=TAG
2. Calculate totals → billing-core.calculateInvoiceTotal()
3. POST /api/sales (invoice header)
4. POST /api/sale-items (one per item) → lifecycle auto-marks item as "sold"
5. POST /api/payments (per payment mode)
6. Lifecycle afterCreate on sale → creates ledger entry + adds loyalty points
```

---

## Development Setup

### 1. Backend

```bash
cd apps/backend
npm install
npm run dev
# Admin: http://localhost:1337/admin
# API:   http://localhost:1337/api
```

### 2. Billing App

```bash
cd apps/billing
cp .env.example .env.local
# Edit .env.local with your Strapi URL and API token
npm install
npm run dev
# http://localhost:3001
```

### 3. Inventory App

```bash
cd apps/inventory
cp .env.example .env.local
npm install
npm run dev
# http://localhost:3002
```

### 4. Run all (from root)

```bash
npm run dev
# Runs billing + inventory + storefront in parallel (backend excluded)

npm run dev:backend
# Runs only the Strapi backend
```

---

## Future Extensions

| Feature | Where |
|---|---|
| Multi-store | `store` relation is on `JewelleryItem`, `Sale`, and `User`. Filter all queries by `store.id` |
| Gold rate auto-update | Add cron in `apps/backend/src/index.ts` calling IBJA API at market open |
| WhatsApp invoices | Add `whatsapp_number` to `Customer`; trigger WATI/Twilio in `sale` afterCreate lifecycle |
| Mobile owner dashboard | Add Next.js PWA config to billing app; expose `/api/owner-summary` custom Strapi endpoint |
| Ecommerce | `storefront` app already exists; wire to same Strapi products/inventory |
