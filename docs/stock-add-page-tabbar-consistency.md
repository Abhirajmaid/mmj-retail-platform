# Stock Add Page Tab Bar Consistency

## What Changed
- Simplified the sticky tab bar wrapper styling in `apps/inventory/app/(back-office)/stock/add/page.tsx` by removing the extra border layer.
- Updated the tab button class names to match the styling pattern used by other stock tab components (active/inactive colors, shadow, spacing, and nowrap).
- Updated `<select>` controls in the stock add tab forms to use `appearance-none` with a consistent chevron indicator, removing the extra “double border” look on Windows browsers.

## Why
- The previous wrapper styling created a “double” background/border feel.
- Tab buttons were not fully consistent with the rest of the back-office stock UI.
- Native select styling + custom borders caused a double border layer in some environments.

## Notes
- No functional logic was changed; this is purely UI/styling consistency.
