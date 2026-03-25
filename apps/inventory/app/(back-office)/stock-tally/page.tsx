"use client";

import StockTallyRfidBarcodePage from "./rfid-barcode/page";

export default function StockTallyPage() {
  // Route /stock-tally now directly renders the RFID/Barcode tally UI
  // to avoid the extra "click card" interaction.
  return <StockTallyRfidBarcodePage />;
}
