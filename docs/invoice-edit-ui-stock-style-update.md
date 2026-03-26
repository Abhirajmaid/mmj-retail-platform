# Invoice Edit UI Stock-Style Update

## What Changed
- Redesigned `apps/billing/app/(pos)/invoices/[id]/edit/page.tsx` to follow stock-add style structure.
- Replaced simple bordered form block with card-based sections:
  - `Customer & Invoice Details`
  - `Preview`
- Migrated inputs/select to stock-like field styles (rounded gray border fields with amber focus ring).
- Added status dropdown chevron treatment for visual consistency with other stock-style forms.
- Replaced bottom action row with stock-like footer actions:
  - `Cancel` (ghost)
  - `Save changes` (amber primary with icon)

## Why
- Keep edit invoice UI consistent with stock module forms and recent billing UI alignment updates.
- Improve readability by grouping editable fields and preview summary into clear sections.
