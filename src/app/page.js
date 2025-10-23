// app/page.js
import Image from "next/image";
import DevotionalNavbar from "./navigation/client";
import Header_frontend_page from "./header_frontend_img/page";
import Category_Client from "./category_frontend_img/client";
import TypeClient from "./Type_frontend_img/page";
// (Optional) Refactor Img_Page into a component later:
import Img_Page from "./img_list_frontend/page";
import { cookies } from "next/headers";
import Script from "next/script";

export const revalidate = 300; // Revalidate server-rendered data every 5 minutes

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pauranikart.com";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7001";

async function fetchLatestImages(limit = 5) {
  const url = `https://www.pauranikart.com/api/v1/api/v1/image?limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { totalCount: 0, data: [] };
  return res.json();
}

// ========= SEO: SSR metadata for the Home page =========
export async function generateMetadata() {
  const payload = await fetchLatestImages(5);
  const items = Array.isArray(payload?.data) ? payload.data : [];

  const title = "PauranikArt – Divine Hindu Art & 4K Wallpapers";
  const description =
    "Download ultra-realistic devotional images and 4K/8K wallpapers of Hindu gods and goddesses — Shiva, Vishnu, Rama, Krishna, Lakshmi, Durga, Hanuman and more. Clean, divine, and high-resolution.";
  const canonical = SITE_URL;

  // Build a compact keyword list from latest items + a stable core
  const coreKeywords = [
    "Sanatan Dharma images",
    "Hindu religion wallpapers",
    "Hindu gods HD wallpapers",
    "Hindu devotional art",
    "Hindu god backgrounds",
    "Sanatan dharm photo gallery",
    "Indian mythology wallpapers",
    "Vedic art images",
    "Spiritual Indian wallpapers",
    "Divine art collection",
    "Lord Shiva images",
    "Mahadev HD wallpapers",
    "Bholenath 4K wallpapers",
    "Shiv Parvati wallpapers",
    "Kailash Parvat HD art",
    "Shivling wallpapers",
    "Lord Shankar art images",
    "Rudra avatar paintings",
    "Mahadev temple background",
    "Tandav Shiva images",
    "Lord Vishnu wallpapers",
    "Narayan HD images",
    "Vishnu on Sheshnag painting",
    "Lord Vishnu art wallpaper",
    "Dashavatara Vishnu images",
    "Narasimha avatar wallpapers",
    "Vamana avatar painting",
    "Varaha avatar art",
    "Kurma avatar wallpapers",
    "Lord Vishnu digital art",
    "Lord Rama HD wallpapers",
    "Ram Sita images",
    "Shri Ram darbar wallpapers",
    "Ramayan scene paintings",
    "Ayodhya Ram Mandir images",
    "Ram Navami wallpapers",
    "Ram Lakshman Hanuman art",
    "Maryada Purushottam Ram images",
    "Sita Mata HD wallpaper",
    "Bharat Shatrughna paintings",
    "Lord Krishna HD wallpapers",
    "Radha Krishna paintings",
    "Krishna flute images",
    "Vrindavan wallpaper",
    "Govardhan Leela painting",
    "Makhan Chor Krishna wallpapers",
    "Baby Krishna images",
    "Janmashtami wallpapers",
    "Radha Krishna love art",
    "Mathura Vrindavan HD images",
    "Goddess Durga wallpapers",
    "Maa Durga HD images",
    "Mahishasuramardini wallpapers",
    "Navratri Durga photos",
    "Shakti Devi paintings",
    "Devi Parvati HD wallpaper",
    "Kali Maa images",
    "Mahakali wallpapers",
    "Chandraghanta Devi HD art",
    "Durga Puja wallpapers",
    "Goddess Lakshmi HD wallpapers",
    "Lakshmi ji on lotus image",
    "Mahalaxmi wallpapers",
    "Lakshmi Mata photo gallery",
    "Dhanteras wallpapers",
    "Diwali Lakshmi photos",
    "Lakshmi Puja wallpapers",
    "Goddess of wealth images",
    "Lakshmi temple background",
    "Golden aura Lakshmi painting",
    "Goddess Saraswati wallpapers",
    "Maa Saraswati HD images",
    "Veena Devi wallpapers",
    "Saraswati Puja wallpapers",
    "Goddess of knowledge photos",
    "Saraswati temple art",
    "White saree Saraswati image",
    "Vasant Panchami wallpapers",
    "Saraswati statue photos",
    "Devi Saraswati vector art",
    "Lord Hanuman HD wallpapers",
    "Bajrangbali 4K wallpapers",
    "Hanuman flying with mountain image",
    "Sanjeevani parvat wallpapers",
    "Panchmukhi Hanuman wallpapers",
    "Hanuman chalisa background",
    "Hanuman temple wallpapers",
    "Hanuman Jayanti images",
    "Devotional Hanuman painting",
    "Mahavir Hanuman HD art",
    "Lord Ganesha wallpapers",
    "Ganpati Bappa HD images",
    "Ganesha 4K wallpapers",
    "Vinayaka art painting",
    "Siddhivinayak temple wallpaper",
    "Ganesh Chaturthi wallpapers",
    "Cute Ganesha images",
    "Lord Ganesha vector art",
    "Ganapati mural art",
    "Ekdanta Ganesh HD photo",
    "Lord Brahma wallpapers",
    "Lord Indra HD images",
    "Lord Surya wallpapers",
    "Lord Chandra HD wallpapers",
    "Lord Kartikeya images",
    "Skanda Murugan wallpapers",
    "Goddess Kamakhya Devi images",
    "Goddess Annapurna HD wallpapers",
    "Dattatreya wallpapers",
    "Shani Dev HD wallpapers",
    "Kashi Vishwanath temple wallpapers",
    "Somnath temple images",
    "Kedarnath HD wallpapers",
    "Badrinath temple photos",
    "Jagannath Puri wallpapers",
    "Tirupati Balaji HD images",
    "Vaishno Devi wallpapers",
    "Rameshwaram temple photos",
    "Dwarkadhish temple wallpapers",
    "Amarnath cave wallpapers",
    "Diwali wallpapers",
    "Navratri wallpapers",
    "Dussehra HD wallpapers",
    "Mahashivratri wallpapers",
    "Ram Navami HD wallpapers",
    "Janmashtami wallpapers",
    "Ganesh Chaturthi wallpapers",
    "Holi festival wallpapers",
    "Chhath Puja HD wallpapers",
    "Kartik Purnima wallpapers",
    "Indian digital painting",
    "Oil painting Hindu art",
    "Acrylic fusion wallpapers",
    "CGI devotional render",
    "Neo Raja Ravi Varma art",
    "Pattachitra Hindu paintings",
    "Tanjore style art wallpapers",
    "Madhubani devotional art",
    "Warli style Hindu images",
    "Hand painted Hindu art",
    "4K Hindu wallpapers",
    "8K devotional images",
    "HD Hindu art downloads",
    "Full HD temple wallpapers",
    "Mobile Hindu wallpapers",
    "iPhone Hindu wallpapers",
    "Android Hindu backgrounds",
    "Desktop Hindu wallpapers",
    "Tablet HD wallpapers",
    "1200x630 Facebook post art",
    "Cinematic Hindu art",
    "Hyper-realistic god images",
    "Divine glow wallpapers",
    "HDR devotional wallpapers",
    "Realistic oil texture images",
    "Temple background HD",
    "Golden aura art wallpaper",
    "Radiant light Hindu images",
    "Holy aura painting",
    "Beautiful face divine art",
    "Peaceful Hindu wallpapers",
    "Spiritual wallpapers HD",
    "Meditation wallpapers India",
    "Yoga background art",
    "Bhakti wallpapers",
    "Devotional prayer wallpapers",
    "Chanting background images",
    "Hindu mantra wallpaper",
    "Aarti photo background",
    "Divine blessings images",
    "God images HD download",
    "Hindu wallpapers free",
    "Indian god pictures",
    "HD god photo gallery",
    "4K god wallpapers free",
    "Best Hindu wallpapers 2025",
    "HD god pics online",
    "Hindu photo download",
    "Spiritual images free",
    "Indian god photo art",
    "Ayyappa Swamy images",
    "Khandoba HD wallpapers",
    "Tulja Bhavani wallpapers",
    "Kanaka Durga wallpapers",
    "Renuka Yellamma images",
    "Bagalamukhi Devi wallpapers",
    "Bhairavi Devi images",
    "Mookambika wallpapers",
    "Chamundeshwari Devi HD art",
    "Manasa Devi wallpapers",
    "Devotional AI art",
    "Hindu digital artwork",
    "Indian spiritual concept art",
    "Fantasy god illustrations",
    "Ultra-realistic deity wallpapers",
    "Divine energy wallpapers",
    "Meditation art backgrounds",
    "Enlightenment wallpapers",
    "Peaceful aura art",
    "Holy Indian god posters",
    "Lord Shiva background download",
    "Krishna wallpaper 4K mobile",
    "Lakshmi HD image download",
    "Durga Maa photo free",
    "Hanuman 4K mobile wallpaper",
    "Ganesh wallpaper for desktop",
    "Vishnu wallpaper 8K",
    "Saraswati HD background",
    "Rama Sita 4K wallpaper",
    "Temple scenery wallpapers",
    "Shiva tandav 4K image",
    "Krishna flute HD photo",
    "Navratri goddess wallpaper",
    "Diwali Lakshmi wallpaper",
    "Mahashivratri Shiva image",
    "Janmashtami Krishna photo",
    "Ganesh Chaturthi HD photo",
    "Ayodhya Ram Mandir wallpaper",
    "Vrindavan temple background",
    "Kedarnath snow temple image",
    "Hyper detailed devotional art",
    "Indian god vector download",
    "Printable Hindu posters",
    "Royalty free Hindu images",
    "Free devotional wallpapers",
    "UHD Hindu wallpapers",
    "Retina resolution god images",
    "Best Hindu backgrounds",
    "Top Hindu wallpapers site",
    "Hindu art gallery online",
    "Pattachitra style wallpapers",
    "Tanjore gold foil art image",
    "Madhubani folk art wallpaper",
    "Warli minimal god art",
    "Classic Indian calendar art"
  ];

  const latestKeywords = items
    .flatMap((x) => (Array.isArray(x.imgKeyword) ? x.imgKeyword : []))
    .slice(0, 20); // don’t overstuff

  const ogImage = items?.[0]?.awsImgUrl || "/og/home-hero.jpg";
//console.log(og)
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | PauranikArt",
    },
    description,
    keywords: [...coreKeywords, ...latestKeywords],
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "PauranikArt",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "PauranikArt – Divine Art" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@PauranikArt",
      creator: "@PauranikArt",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

// ========= Page Component (Server Component) =========
export default async function Home() {
  const token = cookies().get("token")?.value || null;

  // Fetch latest 5 images for the homepage hero/sections/JSON-LD
  const payload = await fetchLatestImages(5);
  const items = Array.isArray(payload?.data) ? payload.data : [];

  // Build JSON-LD (ItemList of ImageObject) for better visibility in Google Images
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/imageDetail/${it.img_slug}`, // ← matches your folder structure
      item: {
        "@type": "ImageObject",
        contentUrl: it.awsImgUrl,
        caption: it.imgHeading,
        license: `${SITE_URL}/license`,
        acquireLicensePage: `${SITE_URL}/license`,
        keywords: Array.isArray(it.imgKeyword) ? it.imgKeyword.join(", ") : it.imgKeyword,
        author: { "@type": "Organization", name: "PauranikArt" },
      },
    })),
  };

  return (
    <>
      {/* JSON-LD for the home feed */}
      <Script
        id="home-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header_frontend_page />
      <Category_Client />
      <TypeClient />
      <Img_Page />
    </>
  );
}
