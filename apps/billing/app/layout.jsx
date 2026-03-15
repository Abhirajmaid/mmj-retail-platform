import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MMJ Billing — POS & CRM",
  description: "Point of Sale and CRM for Mukund Maid Jewellers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-billing`}>{children}</body>
    </html>
  );
}
