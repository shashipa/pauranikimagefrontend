// app/sitemap.js  (OPTIONAL index)
const BASE_URL = "https://www.pauranikart.com";
const LOCAL_URL="http://localhost:3000"

export default function sitemap() {
  return [
    { url: `${BASE_URL}/sitemap/0.xml`, lastModified: new Date() },
    { url: `${BASE_URL}/sitemap/1.xml`, lastModified: new Date() }
  ];
}
