import { Host_Grotesk } from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "MMJ Billing — POS & CRM",
  description: "Point of Sale and CRM for Mukund Maid Jewellers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${hostGrotesk.className} theme-billing`}>{children}</body>
    </html>
  );
}
