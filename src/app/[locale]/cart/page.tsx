import type { Metadata } from "next";
import { CartClient } from "@/components/shop/cart-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "سلة التسوق" : "Your Cart",
    robots: { index: false, follow: false },
  };
}

export default function CartPage() {
  return <CartClient />;
}
