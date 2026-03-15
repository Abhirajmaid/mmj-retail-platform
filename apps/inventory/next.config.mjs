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
  images: {
    domains: ["res.cloudinary.com", "localhost"],
  },
};

export default nextConfig;
