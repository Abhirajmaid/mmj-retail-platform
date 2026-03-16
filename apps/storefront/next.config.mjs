import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@jewellery-retail/ui"],
  // Next 14: use experimental.turbo; Next 15.3+: use turbopack
  experimental: {
    turbo: { root: repoRoot },
  },
  turbopack: { root: repoRoot },
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "source.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "**" },
      { protocol: "http", hostname: "localhost", pathname: "**" },
    ],
  },
};

export default nextConfig;
