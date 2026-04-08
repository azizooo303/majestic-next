import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Majestic Furniture",
  description: "Premium office furniture. Where architecture meets furniture.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/majestic-logo-black.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
