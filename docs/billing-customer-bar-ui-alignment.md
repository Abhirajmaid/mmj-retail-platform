# Billing Customer Bar UI Alignment

## What Changed
- Removed the `Customers / Invoice` toggle from the billing dashboard customer bar.
- Kept a single customer search form and retained existing customer result behavior.
- Updated customer input and select controls to match inventory stock form styling (rounded inputs, gray borders, amber focus ring, select chevron).
- Restyled the four quick action buttons (`HOME`, `SELL`, `LOAN`, `UDHAAR`) to match the inventory stock primary action style.

## Why
- Align the billing top form with the inventory stock page look and feel for consistent UX.
- Simplify the header interaction by removing the mode switch and focusing on customer-first flow.

## Notes
- Invoice search UI and invoice result list were removed from this component as part of this alignment request.

## Follow-up Update
- Added visible labels above all customer fields to match inventory stock form pattern.
- Fixed select/dropdown focus styling to remove browser black border and use amber-focused border/ring styling.
- Removed blue focus-visible ring on customer form inputs/selects and kept non-blue focused border styling.
- Migrated customer text fields from shared `Input` to native `<input>` using the same stock add `inputClass` pattern for exact visual parity with `apps/inventory/app/(back-office)/stock/add/page.tsx`.
- Restyled `Create New Customer` no-result action button to neutral outline style (like inventory `Transfer stock`) by removing blue-accent border/text and using zinc border/text with subtle hover.
