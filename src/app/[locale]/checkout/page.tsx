import type { Metadata } from "next";
import { CheckoutClient } from "@/components/shop/checkout-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "إتمام الطلب" : "Checkout",
    robots: { index: false, follow: false },
  };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
