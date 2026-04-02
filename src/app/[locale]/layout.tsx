import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Raleway, Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatePresenceWrapper } from "@/components/common/animate-presence-wrapper";
import "../globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thedeskco.net"),
  title: {
    default: "Majestic Furniture",
    template: "%s | Majestic Furniture",
  },
  description: "Premium office furniture. Where architecture meets furniture.",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Majestic Furniture",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${raleway.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0c0c0c] font-sans pt-[76px] md:pt-[196px]">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0c0c0c] focus:text-white focus:rounded-md focus:font-medium"
          >
            Skip to content
          </a>
          <Header />
          <AnimatePresenceWrapper>
            {children}
          </AnimatePresenceWrapper>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
