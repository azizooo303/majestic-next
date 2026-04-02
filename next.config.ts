import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ['@vercel/edge-config'],
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lightyellow-mallard-240169.hostingersite.com",
      },
      {
        protocol: "https",
        hostname: "thedeskco.net",
      },
      {
        protocol: "https",
        hostname: "*.cloudways.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

