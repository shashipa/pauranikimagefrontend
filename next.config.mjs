/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || "https://pauranikart.com"; // your Express base
const CF_HOST = process.env.CF_HOST || "d3n4j7i52d5ghc.cloudfront.net"; // your CloudFront domain

const nextConfig = {
  reactStrictMode: true,

  // If you ever switch to next/image, this allows your CloudFront domain.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: CF_HOST }, // e.g. d3n4j7i52d5ghc.cloudfront.net
    ],
    // unoptimized: true, // uncomment if you see query params getting stripped by optimizer
  },

  // ✅ NEW: redirect non-www → www (SEO + canonical consistency)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pauranikart.com", // if request comes to non-www
          },
        ],
        destination: "https://www.pauranikart.com/:path*", // send it to www
        permanent: true,
      },
    ];
  },

  // Proxy /api/v1/* to your Node API to avoid CORS
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },

  // Helpful headers for local dev; adjust as needed
  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
