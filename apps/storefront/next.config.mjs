/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@jewellery-retail/ui"],
  // reactStrictMode: false,
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "res.cloudinary.com",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
