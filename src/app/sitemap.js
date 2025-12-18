// app/sitemap.js
const BASE_URL = "https://www.pauranikart.com";
const PAGE_SIZE = 45000;
export const revalidate = 3600; // Rebuild every hour

export default async function sitemap() {
  // ---- 1️⃣ Static pages ----
  const staticPages = [
    "/",
    "/about",
    "/terms",
    "/privacy",
    "/license",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1.0 : 0.8,
  }));

  // ---- 2️⃣ Deity folders ----
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

  // ---- 3️⃣ Dynamic imageDetail pages ----
  const dynamicUrls = await getImageUrls();

  return [...staticPages, ...deities, ...dynamicUrls];
}

// Helper: Fetch your image img_slugs from API
async function getImageUrls() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/api/v1/image`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const arr = Array.isArray(json?.data) ? json.data : [];

    return arr.map((item) => ({
      url: `${BASE_URL}/imageDetail/${item.img_slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    }));
  } catch (err) {
    console.error("❌ Sitemap fetch error:", err);
    return [];
  }
}
