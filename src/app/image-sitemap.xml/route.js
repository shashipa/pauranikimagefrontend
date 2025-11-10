// Next.js App Router API Route for Image Sitemap
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

// IMPORTANT: Replace with your actual live domain
const BASE_URL = 'https://www.pauranikart.com'; 
const API_BASE_URL = 'https://www.pauranikart.com/api/v1/api/v1/image'; // Your live API endpoint

// Helper function to fetch dynamic image data
async function getImageSitemapData() {
    try {
        // Fetch full data needed for Image Sitemap (slug, URL, heading, description, date)
        // Ensure your Express endpoint supports filtering the necessary fields for performance.
        const res = await fetch(API_BASE_URL, {
            next: { revalidate: 3600 }, // Revalidate cache every hour
        });
        const json = await res.json();
        return Array.isArray(json?.data) ? json.data : [];
    } catch (err) {
        console.error("❌ Image Sitemap fetch error:", err);
        return [];
    }
}

// Helper function to generate the Image XML string
function generateImageSitemapXml(images) {
    // 1. Set the image namespace (crucial for Google Image indexing)
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    const xmlUrls = images.map(image => {
        // 2. The <loc> points to the page hosting the image
        const pageUrl = `${BASE_URL}/imageDetail/${image.img_slug}`;
        
        // 3. Image specific metadata (using your data structure)
        return `
            <url>
                <loc>${pageUrl}</loc>
                <lastmod>${format(new Date(image.updatedAt), 'yyyy-MM-dd')}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.9</priority>
                <image:image>
                    <image:loc>${image.awsImgUrl}</image:loc> 
                    <image:title>${image.imgHeading}</image:title>
                    <image:caption>${image.imgDesc}</image:caption>
                </image:image>
            </url>
        `;
    }).join('');

    return `${xmlHeader}${xmlUrls}</urlset>`;
}

// Main GET function for the route
export async function GET() {
    const images = await getImageSitemapData();
    const sitemapXml = generateImageSitemapXml(images);

    // Return the response with the correct headers for XML
    return new NextResponse(sitemapXml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 24 hours
        },
    });
}