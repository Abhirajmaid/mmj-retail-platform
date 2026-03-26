# @jewellery-retail/backend

Strapi v5 headless CMS backend for the jewellery retail platform.

- REST API: `http://localhost:1337/api`
- GraphQL: `http://localhost:1337/graphql`
- Admin Panel: `http://localhost:1337/admin`

---

## Setup

### 1 — Environment variables

```bash
cp .env.example .env
```

Edit `.env` with real values (generate random keys with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`).

### 2 — Install dependencies

From the **monorepo root**:

```bash
npm install
```

### 3 — Start PostgreSQL (recommended team setup)

From `apps/backend`:

```bash
npm run db:up
```

This starts a local PostgreSQL container (`postgres:16`) with persistent Docker volume storage.

To stop it:

```bash
npm run db:down
```

### 4 — SQLite on Windows (optional fallback)

The backend is configured for PostgreSQL by default.  
If you explicitly want SQLite for solo/local work:

1. Install SQLite driver:

```bash
npm install better-sqlite3
```

2. Update `.env`:

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

If `better-sqlite3` fails to build on Windows, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with **Desktop development with C++**.

---

## Running

```bash
# Development (auto-restarts on changes)
npm run dev

# Production build then start
npm run build
npm run start

# Seed initial data (3 categories, 10 products, 2 suppliers)
npm run seed
```

From the **monorepo root** all apps run together:

```bash
npm run dev
```

| Service        | URL                           |
|----------------|-------------------------------|
| Storefront     | http://localhost:3000         |
| Inventory      | http://localhost:3001         |
| Billing        | http://localhost:3002         |
| Strapi Admin   | http://localhost:1337/admin   |
| REST API       | http://localhost:1337/api     |
| GraphQL        | http://localhost:1337/graphql |

---

## REST API Endpoints

| Method | Endpoint              | Auth     |
|--------|-----------------------|----------|
| GET    | /api/products         | Public   |
| GET    | /api/products/:id     | Public   |
| GET    | /api/categories       | Public   |
| GET    | /api/categories/:id   | Public   |
| GET    | /api/orders           | JWT      |
| POST   | /api/orders           | JWT      |
| GET    | /api/customers        | JWT      |
| POST   | /api/customers        | JWT      |
| GET    | /api/invoices         | JWT      |
| POST   | /api/invoices         | JWT      |
| GET    | /api/inventories      | JWT      |
| GET    | /api/suppliers        | JWT      |

---

## Content Types

| Name       | Kind             | Draft/Publish |
|------------|------------------|---------------|
| Product    | collectionType   | Yes           |
| Category   | collectionType   | Yes           |
| Order      | collectionType   | No            |
| Customer   | collectionType   | No            |
| Inventory  | collectionType   | No            |
| Supplier   | collectionType   | No            |
| Invoice    | collectionType   | No            |

---

## Regenerating TypeScript types

```bash
npm run type-gen
```

This updates `types/generated.d.ts` from the current schemas.
