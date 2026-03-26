# Stock Tally Table UI Alignment

## What changed

- Updated the `TallyTablesPanel` table UI in `stock-tally/rfid-barcode` to match the stock page data component style.
- Replaced the custom table body-only layout with a full shared `@jewellery-retail/ui` table structure (`TableHead`, `TableRow`, `TableHeader`, `TableBody`, `TableCell`).
- Aligned table shell styling to stock UI patterns: rounded border container, light shadow, fixed column layout, and consistent row/header spacing.
- Removed the per-column filter grid above the table and kept a single toolbar search for a cleaner, consistent data-component experience.
- Restyled the toolbar to match the stock transfer list bar: search with icon, circular filter (rows per page popover), `Actions` dropdown, and an `Export` dropdown (Copy/CSV/Excel/JSON/PDF/Print).
- Refreshed the top stock-tally control card (`Manually`, open/close actions, counter/location/category inputs, reset/report buttons) to match the same rounded, border, spacing, and button hierarchy used across stock/transfer pages.
- Enhanced the split `Non tally / Tally` panels with improved visual hierarchy: premium card elevation, subtle header gradient, stronger icon chips, cleaner empty states, and interactive item-card hover motion for a more polished UX.

## Why

- The previous table looked visually inconsistent with the stock page data component.
- Using the shared `@jewellery-retail/ui` table pattern keeps styling and behavior consistent across back-office screens.
