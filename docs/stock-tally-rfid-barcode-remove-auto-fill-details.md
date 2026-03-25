# Stock Tally Auto-Fill Details Removed

## What Changed
- Removed the feature that automatically filled the right-table column filter inputs (“PRODUCT ID / METAL TYPE / CATEGORY / PRODUCT NAME / QTY / GS WT / NT WT / FN WT”) after adding items to the tally panel.

## Why
- The auto-fill behavior was causing unwanted UI changes and made it harder to manually control the filter fields after adding/removing rows.

## Notes
- Column filters now behave only via the user typing into the filter inputs (no more `autoFillItem` propagation).
