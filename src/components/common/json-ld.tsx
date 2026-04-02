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
    url: "https://thedeskco.net",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://thedeskco.net/en/shop?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={data} />;
}

// ── LocalBusiness ──────────────────────────────────────────────────────────────

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Majestic Furniture",
    url: "https://thedeskco.net",
    // TODO: fill in real telephone number
    telephone: "+966-XX-XXXXXXX",
    address: {
      "@type": "PostalAddress",
      // TODO: fill in real street address
      streetAddress: "TBD",
      addressLocality: "Riyadh",
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
        closes: "18:00",
      },
    ],
    priceCurrency: "SAR",
    areaServed: ["SA", "AE", "KW", "BH", "QA", "OM"],
  };
  return <JsonLd data={data} />;
}
