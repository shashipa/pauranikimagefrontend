// app/sitemap/[id]/sitemap.js

const BASE_URL = "https://www.pauranikart.com";
const PAGE_SIZE = 45000;
export const revalidate = 3600;

// Step 1: Tell Next.js how many sitemaps exist
export async function generateSitemaps() {
  try {
    const total = await getImageTotal();
    const chunks = Math.ceil(total / PAGE_SIZE);

    // 0 = static + deities, 1..N = imageDetail chunks
    return Array.from({ length: chunks + 1 }, (_, i) => ({ id: String(i) }));
  } catch (err) {
    console.error("❌ generateSitemaps error:", err);
    return [{ id: "0" }];
  }
}

// Step 2: Generate XML for each child sitemap
export default async function sitemap({ params }) {
  const { id } = params;

  if (id === "0") {
    // ✅ STATIC pages
    const staticPages = [
      `${BASE_URL}/`,
      `${BASE_URL}/about`,
      `${BASE_URL}/terms`,
      `${BASE_URL}/privacy`,
      `${BASE_URL}/license`,
      `${BASE_URL}/contact`,
    ].map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    // ✅ DEITIES (your folders)
    const deities = [
      "lordganesh",
      "godessdurga",
      "godesskali",
      "lordshankar",
      "lordvishnu",
      "lordram",
      "lordkrishna",
      "godesslakshmi",
      "godesssaraswati",
      "lordhanuman",
    ].map((key) => ({
      url: `${BASE_URL}/${key}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...deities];
  }

  // ✅ Dynamic imageDetail pages
  const page = parseInt(id, 10);
  if (Number.isNaN(page) || page < 1) return [];

  const offset = (page - 1) * PAGE_SIZE;
  const slugs = await getImageSlugs({ offset, limit: PAGE_SIZE });

  return slugs.map((slug) => ({
    url: `${BASE_URL}/imageDetail/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  }));
}

// Step 3: Fetch total count from API
async function getImageTotal() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/image`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data.length : 0;
  } catch (err) {
    console.error("❌ getImageTotal error:", err);
    return 0;
  }
}

// Step 4: Fetch real slugs from your API
async function getImageSlugs({ offset, limit }) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/image`, { next: { revalidate: 3600 } });
    const json = await res.json();
    const arr = Array.isArray(json?.data) ? json.data : [];
    const slice = arr.slice(offset, offset + limit);
    return slice.map((item) => item.slug);
  } catch (err) {
    console.error("❌ getImageSlugs error:", err);
    return [];
  }
}
