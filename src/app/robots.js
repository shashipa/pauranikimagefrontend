// app/robots.js
export default function robots() {
  const base = "http://localhost3000";
  return {
    rules: { userAgent: "*", allow: ["/"] },
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
