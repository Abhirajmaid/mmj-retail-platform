# Reusable Page Header

## What
A reusable **PageHeader** component in `@jewellery-retail/ui` for a per-page header that matches the CRM-style layout: breadcrumbs, title, subtitle, and an optional right-side actions area (e.g. HELP, user menu, notifications).

## API
- **breadcrumbs** (optional): `BreadcrumbItem[]` — `{ label: string; href?: string }`. Last item is the current page (omit `href`).
- **title**: string
- **description** (optional): string
- **actions** (optional): `ReactNode` — Rendered on the right (e.g. HELP button, bell, user dropdown).
- **className** (optional): string

## Usage
Use once per page inside the main content area. Each page can pass its own breadcrumbs, title, description, and actions.

```tsx
import { Button, PageHeader } from "@jewellery-retail/ui";

<PageHeader
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Firm", href: "/firm" },
    { label: "Add New" },
  ]}
  title="Add New Firm"
  description="Create a new firm or branch with company information and form details."
  actions={<Button>HELP</Button>}
/>
```

## Styling
The header is a white, rounded panel with a light border and shadow. Breadcrumbs are small grey text; the current segment is bold dark. Title and description sit below; actions align to the right on larger screens.
