// // app/image-sitemap.xml/route.js
// import { NextResponse } from 'next/server';
// import { format } from 'date-fns';

// const BASE_URL = 'https://www.pauranikart.com';
// const API_BASE_URL = 'https://www.pauranikart.com/api/v1/image';

// // --- NEW: Helper function to escape XML special characters ---
// function escapeXml(unsafe) {
//     if (typeof unsafe !== 'string') {
//         return ''; // Return empty string if data is null or undefined
//     }
//     return unsafe.replace(/[<>&'"]/g, function (c) {
//         switch (c) {
//             case '<': return '&lt;';
//             case '>': return '&gt;';
//             case '&': return '&amp;';
//             case '\'': return '&apos;';
//             case '"': return '&quot;';
//             default: return ''; // Should be unreachable
//         }
//     });
// }
// // -----------------------------------------------------------

// async function getImageSitemapData() {
//     try {
//         const res = await fetch(API_BASE_URL, { next: { revalidate: 3600 } });
//         const json = await res.json();
//         return Array.isArray(json?.data) ? json.data : [];
//     } catch (err) {
//         console.error("❌ Image Sitemap fetch error:", err);
//         return [];
//     }
// }

// function generateImageSitemapXml(images) {
//     const fallbackDate = format(new Date(), 'yyyy-MM-dd');
    
//     const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
//         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

//     const xmlUrls = images.map(image => {
//         const pageUrl = `${BASE_URL}/imageDetail/${image.img_slug}`;
        
//         // Use the safe date formatter from the previous fix
//         const lastModifiedDate = image.updatedAt 
//             ? format(new Date(image.updatedAt), 'yyyy-MM-dd')
//             : fallbackDate;

//         // --- FIX IMPLEMENTED HERE: Escape the content ---
//         const safeTitle = escapeXml(image.imgHeading);
//         const safeCaption = escapeXml(image.imgDesc);
//         // ------------------------------------------------

//         return `
//             <url>
//                 <loc>${pageUrl}</loc>
//                 <lastmod>${lastModifiedDate}</lastmod>
//                 <changefreq>weekly</changefreq>
//                 <priority>0.9</priority>
//                 <image:image>
//                     <image:loc>${image.awsImgUrl}</image:loc> 
//                     <image:title>${safeTitle}</image:title>
//                     <image:caption>${safeCaption}</image:caption>
//                 </image:image>
//             </url>
//         `;
//     }).join('');

//     return `${xmlHeader}${xmlUrls}</urlset>`;
// }

// export async function GET() {
//     const images = await getImageSitemapData();
//     const sitemapXml = generateImageSitemapXml(images);

//     return new NextResponse(sitemapXml, {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/xml',
//             'Cache-Control': 's-maxage=86400, stale-while-revalidate',
//         },
//     });
// }