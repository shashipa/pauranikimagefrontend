/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7001'; // your Express base
const CF_HOST = process.env.CF_HOST || 'd3n4j7i52d5ghc.cloudfront.net'; // your CloudFront domain

const nextConfig = {
  reactStrictMode: true,

  // If you ever switch to next/image, this allows your CloudFront domain.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: CF_HOST }, // e.g. d3n4j7i52d5ghc.cloudfront.net
    ],
    // uncomment if you see query params getting stripped by optimizer
    // unoptimized: true,
  },

  // Proxy /api/v1/* to your Node API to avoid CORS
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },

  // Helpful headers for local dev; adjust as needed
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
