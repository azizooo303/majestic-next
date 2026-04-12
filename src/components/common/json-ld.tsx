import { siteUrl } from "@/lib/site-url";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── BreadcrumbList ─────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbListJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbListJsonLd({ items }: BreadcrumbListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
  return <JsonLd data={data} />;
}

// ── FAQPage ────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqPageJsonLdProps {
  faqs: FaqItem[];
}

export function FaqPageJsonLd({ faqs }: FaqPageJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}

// ── WebSite ────────────────────────────────────────────────────────────────────

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Majestic Furniture",
    url: siteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl("/en/shop")}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={data} />;
}

// ── Organization + FurnitureStore (unified) ────────────────────────────────────

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "FurnitureStore"],
    "@id": "https://majestic-next.vercel.app/#organization",
    name: "Majestic Furniture",
    url: siteUrl(),
    logo: {
      "@type": "ImageObject",
      url: siteUrl("/images/logo/majestic-logo.png"),
    },
    email: "info@majestic.com.sa",
    telephone: "+966920012019",
    priceRange: "SAR $$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Olaya District",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Region",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    priceCurrency: "SAR",
    areaServed: ["SA", "AE", "KW", "BH", "QA", "OM"],
    sameAs: [
      "https://www.instagram.com/majesticarabia/",
      "https://www.linkedin.com/company/majestic-office-for-furniture/",
    ],
  };
  return <JsonLd data={data} />;
}

/**
 * @deprecated Use OrganizationJsonLd instead — it now covers both Organization
 * and FurnitureStore in a single unified entity.
 */
export function LocalBusinessJsonLd() {
  return <OrganizationJsonLd />;
}

// ── Product ────────────────────────────────────────────────────────────────────

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency?: string;
  url: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  currency = "SAR",
  url,
  availability = "InStock",
}: ProductJsonLdProps) {
  // priceValidUntil = 1 year from build time (ISO date string, date portion only)
  const priceValidUntil = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const offersBlock =
    price > 0
      ? {
          offers: {
            "@type": "Offer",
            price: price.toString(),
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
            url,
            priceValidUntil,
            seller: {
              "@id": "https://majestic-next.vercel.app/#organization",
            },
          },
        }
      : {};

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
    },
    sku,
    brand: {
      "@type": "Brand",
      name: "Majestic Furniture",
    },
    ...offersBlock,
  };

  return <JsonLd data={data} />;
}

// ── BlogPosting ────────────────────────────────────────────────────────────────

interface BlogPostingJsonLdProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string; // ISO 8601
  dateModified?: string; // ISO 8601
  url: string;
  slug: string;
}

export function BlogPostingJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
}: BlogPostingJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    url,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Organization",
      "@id": "https://majestic-next.vercel.app/#organization",
      name: "Majestic Furniture",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://majestic-next.vercel.app/#organization",
      name: "Majestic Furniture",
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/images/logo/majestic-logo.png"),
      },
    },
  };
  return <JsonLd data={data} />;
}

// ── ShowroomLocalBusiness ──────────────────────────────────────────────────────

interface ShowroomLocalBusinessProps {
  id: string;
  name: string;
  address: string;
  city: string;
  telephone?: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
}

export function ShowroomLocalBusinessJsonLd({
  id,
  name,
  address,
  city,
  telephone,
  mapsUrl,
  latitude,
  longitude,
}: ShowroomLocalBusinessProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `https://majestic-next.vercel.app/#showroom-${id}`,
    name,
    url: siteUrl("/en/showrooms"),
    parentOrganization: {
      "@id": "https://majestic-next.vercel.app/#organization",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: city,
      addressCountry: "SA",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    ...(telephone ? { telephone } : {}),
    ...(mapsUrl ? { hasMap: mapsUrl } : {}),
    ...(latitude !== undefined && longitude !== undefined
      ? { geo: { "@type": "GeoCoordinates", latitude, longitude } }
      : {}),
  };
  return <JsonLd data={data} />;
}
