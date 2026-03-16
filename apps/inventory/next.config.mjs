import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@jewellery-retail/api",
    "@jewellery-retail/hooks",
    "@jewellery-retail/types",
    "@jewellery-retail/ui",
    "@jewellery-retail/utils",
    "@jewellery-retail/inventory-core",
    "@jewellery-retail/reports-core",
  ],
  turbopack: { root: repoRoot },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "http", hostname: "localhost", pathname: "**" },
    ],
  },
};

export default nextConfig;
