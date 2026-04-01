import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Majestic Furniture",
  description: "Premium office furniture. Where architecture meets furniture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
