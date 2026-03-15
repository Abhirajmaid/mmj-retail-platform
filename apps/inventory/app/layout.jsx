import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MMJ Inventory — Back Office",
  description: "Stock management and manufacturing for Mukund Maid Jewellers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-inventory`}>{children}</body>
    </html>
  );
}
