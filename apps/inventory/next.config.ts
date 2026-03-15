import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@jewellery-retail/ui",
    "@jewellery-retail/auth",
    "@jewellery-retail/utils",
    "@jewellery-retail/hooks",
    "@jewellery-retail/config",
    "@jewellery-retail/billing",
  ],
};

export default nextConfig;
