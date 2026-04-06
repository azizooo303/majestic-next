import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

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
    ],
  },
};

const baseConfig = withAnalyzer(withNextIntl(nextConfig));

export default withSentryConfig(baseConfig, {
  org: "majestic-furniture",
  project: "majestic-next",
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: { disable: true },
});

