
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Script from "next/script";
import { cookies } from "next/headers";
import Footer from "./footer/page";


// ---- Config ----
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pauranikart.com";
const BRAND = "PauranikArt";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

// ---- Global SEO (fallbacks; page-level generateMetadata will override as needed) ----
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} – Divine Hindu Art & 4K Wallpapers`,
    template: `%s | ${BRAND}`,
  },
  description:
    "Download ultra-realistic devotional images and 4K/8K wallpapers of Hindu gods and goddesses — Shiva, Vishnu, Rama, Krishna, Lakshmi, Durga, Hanuman and more.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND,
    title: `${BRAND} – Divine Hindu Art & 4K Wallpapers`,
    description:
      "Ultra-realistic Hindu deity images and wallpapers in 4K/8K with devotional artistry.",
    images: [{ url: "/og/home-hero.jpg", width: 1200, height: 630, alt: `${BRAND} – Divine Art` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PauranikArt",
    creator: "@PauranikArt",
    title: `${BRAND} – Divine Hindu Art & 4K Wallpapers`,
    description:
      "Ultra-realistic Hindu God images and wallpapers in 4K/8K with devotional artistry.",
    images: ["/og/home-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  // cookies() is synchronous in App Router
  const token = cookies().get("token")?.value || "";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/shashi.s.pathak",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@pauranik.org",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  const siteNavJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "SiteNavigationElement", name: "Home", url: `${SITE_URL}/` },
      { "@type": "SiteNavigationElement", name: "Shiva Wallpapers", url: `${SITE_URL}/lordshankar` },
      { "@type": "SiteNavigationElement", name: "Krishna Wallpapers", url: `${SITE_URL}/lordkrishna` },
      { "@type": "SiteNavigationElement", name: "Lakshmi Wallpapers", url: `${SITE_URL}/godesskali` },
      { "@type": "SiteNavigationElement", name: "All Images", url: `${SITE_URL}/` },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7353691782374008"
     crossorigin="anonymous"></script>
        {/* Preconnect to your CDN or S3 (adjust host as needed) */}
        <link rel="preconnect" href="https://d3n4j7i52d5ghc.cloudfront.net" crossOrigin="" />
      </head>
      <body>
        {/* Global JSON-LD */}
        <Script id="jsonld-organization" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Script id="jsonld-website" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
        <Script id="jsonld-sitenav" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }} />

        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
          `}
        </Script>

        {children}
        <Footer/>
      </body>
    </html>
  );
}
