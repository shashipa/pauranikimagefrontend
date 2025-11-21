// app/imageDetail/[slug]/page.js
import Script from "next/script";
import { notFound } from "next/navigation";
import ImageDetailClient from "./client";
import { cookies } from "next/headers";
import DevotionalNavbar from "@/app/navigation/client";

// ✅ Use ONE canonical base everywhere (choose www OR non-www and stick to it)
const SITE_URL = "https://www.pauranikart.com";

export const revalidate = 900; // 15 min ISR

function pickImage(payload) {
  return payload?.data?.data ?? payload?.data ?? null;
}

async function fetchImageBySlug(slug) {
  // ✅ API URL – adjust this to your real API path, but keep the SAME domain as SITE_URL if possible
  const apiUrl = `${SITE_URL}/api/v1/api/v1/single/image?slug=${encodeURIComponent(
    slug
  )}`;

  const res = await fetch(apiUrl, {
    // you can also use { next: { revalidate: 900 } } if you want ISR here
    cache: "no-store",
  });

  if (!res.ok) return null;
  const payload = await res.json();
  return pickImage(payload);
}

// deityRouteMap (unchanged)
const deityRouteMap = {
  "lord ganesha": "lordganesh",
  ganesha: "lordganesh",
  ganesh: "lordganesh",

  "lord hanuman": "lordhanuman",
  hanuman: "lordhanuman",
  bajrangbali: "lordhanuman",

  "lord krishna": "lordkrishna",
  krishna: "lordkrishna",
  "shri krishna": "lordkrishna",

  "lord rama": "lordram",
  "lord ram": "lordram",
  rama: "lordram",
  ram: "lordram",

  "lord shankar": "lordshankar",
  shankar: "lordshankar",
  mahadev: "lordshankar",
  "lord shiva": "lordshankar",
  shiva: "lordshankar",
  bholenath: "lordshankar",

  "lord vishnu": "lordvishnu",
  vishnu: "lordvishnu",
  narayan: "lordvishnu",
};

function deityRoute(name) {
  const k = (name || "").toLowerCase().trim();
  return deityRouteMap[k] || k.replace(/\s+/g, "");
}

/* ---------------------------------------
   Metadata
--------------------------------------- */
export async function generateMetadata({ params }) {
  const slug = params?.slug ?? "";
  const img = await fetchImageBySlug(slug);

  if (!img || img.isLive === false) {
    return {
      title: "Not Found | PauranikArt",
      description: "The requested image could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const normalizedSlug = encodeURIComponent(img.img_slug || slug);

  const title = `${img.imgHeading} | PauranikArt`;
  const description = img.imgDesc || img.imgHeading;
  const canonical = `${SITE_URL}/imageDetail/${normalizedSlug}`;
  const og = img.awsImgUrl || "/og/home-hero.jpg";

  return {
    // If you also set metadataBase in root layout, you can keep this commented or remove it
    // metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: img.imgHeading,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: Array.isArray(img.imgKeyword)
      ? img.imgKeyword
      : [img.godName, "Hindu Art", "Devotional Wallpapers"].filter(Boolean),
  };
}

/* ---------------------------------------
   Page
--------------------------------------- */
export default async function ImageDetailPage({ params }) {
  const slug = params?.slug ?? "";

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userId = cookieStore.get("userId")?.value;
  const email = cookieStore.get("email")?.value;

  const detail = await fetchImageBySlug(slug);
  if (!detail || detail.isLive === false) notFound();

  const normalizedSlug = encodeURIComponent(detail.img_slug || slug);
  const canonicalUrl = `${SITE_URL}/imageDetail/${normalizedSlug}`;
  const ogImage = detail.awsImgUrl || "logo.png";
  const altText = detail.imgHeading || "Divine Hindu art wallpaper";

  const keywordsCsv = Array.isArray(detail.imgKeyword)
    ? detail.imgKeyword.join(", ")
    : detail.imgKeyword || "";

  // JSON-LD: ImageObject
  const imageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: detail.imgHeading,
    caption: detail.imgDesc || detail.imgHeading,
    contentUrl: detail.awsImgUrl,
    url: canonicalUrl, // ✅ matches canonical above & in generateMetadata
    logo: detail.awsImgUrl,
    license: `${SITE_URL}/license`,
    keywords: keywordsCsv,
    author: {
      "@type": "Organization",
      name: "PauranikArt",
      url: SITE_URL,
    },
  };

  const secondCrumbName = detail.godName || "Images";
  const secondCrumbPath = deityRoute(secondCrumbName);
  const secondCrumbUrl = `${SITE_URL}/${secondCrumbPath}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: secondCrumbName,
        item: secondCrumbUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: detail.imgHeading,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <DevotionalNavbar token={token} />

      {/* Structured Data */}
      <Script
        id="image-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageJsonLd) }}
      />
      <Script
        id="image-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ImageDetailClient data={detail} />
    </>
  );
}
