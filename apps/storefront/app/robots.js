export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/sign-in/",
          "/sign-up/",
          "/profile/",
          "/privacy-policies/",
          "/scripts/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

