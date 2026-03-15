/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@jewellery-retail/api",
    "@jewellery-retail/ui",
    "@jewellery-retail/hooks",
    "@jewellery-retail/types",
    "@jewellery-retail/utils",
    "@jewellery-retail/billing",
    "@jewellery-retail/crm-core",
  ],
  images: {
    domains: ["res.cloudinary.com", "localhost"],
  },
};

export default nextConfig;
