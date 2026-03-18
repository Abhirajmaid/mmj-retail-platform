# Dashboard & Search UI Updates

## What Changed

- **Invoice hint and results**: The grey hint and the invoice results list now only appear when the user has entered at least one search/filter value—matching the Customers tab. With no search input, only the filter card (tabs + inputs + actions) is shown.
- **Invoice empty state actions**: When invoice search yields no matches, the empty state now shows action buttons (similar to Customers): “View Invoices” and “Create New Bill”.
- **Dashboard invoice fields**: The Dashboard “Invoice” tab filters now use the same “Billing header” fields layout as the bill screen (bill date, customer/billing name, invoice prefix/no, firm/account, sale executive/month). Filtering is currently applied for bill date, customer/billing name, and invoice prefix/no (other fields are UI placeholders until invoice data contains them).
- **Customer Growth chart**: The chart card uses flex layout so the chart area fills the card height (min height 280px, grows with the grid row).
- **Market rates card**: Gold and Silver rows now show a coin icon next to the metal name (amber for gold, silver/grey for silver).
- **Market rates card (units)**: Gold/Silver rows now include dropdowns to switch the displayed unit in grams (e.g. 1/10/100 gm). Gold also supports a karat dropdown (24k/22k/20k/18k). Prices recompute from the current stored market rate.

## Why

- Reduce clutter when not searching; hint is shown only when relevant.
- Better use of space so the growth chart doesn’t leave empty space at the bottom of the card.
- Clearer visual distinction for Gold vs Silver in the market rates block.

## Files Touched

- `apps/billing/src/components/CustomerSearchBar.tsx` — conditional hint
- `apps/billing/app/(pos)/dashboard/page.tsx` — Customer Growth card layout
- `apps/billing/src/components/MetalRatesCard.tsx` — metal icons (Lucide `Coins`)
