// app/about/page.js
import "./about.css";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export const metadata = {
  title: "About Us – PauranikArt | Divine Hindu Art & Sanatan Heritage",
  description:
    "Learn about PauranikArt – a divine digital art platform dedicated to preserving Sanatan Dharma through realistic Hindu deity paintings and sacred art. Discover our vision, mission, and purpose.",
  alternates: { canonical: "https://www.pauranikart.com/about" },
  openGraph: {
    title: "About PauranikArt – Divine Hindu Art & Sanatan Heritage",
    description:
      "PauranikArt brings the essence of Sanatan Dharma alive through high-quality devotional art and hyper-realistic images of Hindu Gods and Goddesses.",
    url: "https://www.pauranikart.com/aboutus",
    images: [
      {
        url: "https://www.pauranikart.com/images/icon.png",
        width: 1200,
        height: 630,
        alt: "PauranikArt – About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PauranikArt – Divine Hindu Art & Sanatan Heritage",
    description:
      "Discover PauranikArt’s vision to preserve India’s spiritual culture through digital paintings of Hindu Gods and Goddesses.",
    images: ["https://www.pauranikart.com/images/icon.png"],
  },
};

export default async function AboutPage() {
  const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
  return (
    <>
    <DevotionalNavbar token={token}/>
    <main className="about-container">
      <section className="hero">
        <h1 className="title">About PauranikArt</h1>
        <p className="subtitle">
          Preserving Sanatan Dharma Through Divine Digital Art
        </p>
      </section>

      <section className="content">
        <h2>Who We Are</h2>
        <p>
          <strong>PauranikArt.com</strong> is a sacred digital platform born out of deep devotion to
          <em> Sanatan Dharma</em> — the eternal way of life. Our purpose is to reconnect people
          across the world with the divine roots of Hindu culture through
          <b> devotional, ultra-realistic digital paintings and wallpapers</b> of Hindu Gods,
          Goddesses, temples, and sacred mythological scenes.
        </p>

        <h2>Our Vision</h2>
        <p>
          We envision a world where art becomes a medium of spirituality. At PauranikArt,
          every creation carries divine vibration — blending ancient aesthetics with modern
          digital craftsmanship. Our goal is to make <em>authentic Hindu spiritual art</em> accessible
          to everyone, everywhere.
        </p>

        <h2>Our Mission</h2>
        <p>
          To revive and preserve India’s ancient art forms through technology,
          creating a bridge between devotion and digital artistry. Every image on
          PauranikArt is a reflection of purity, devotion, and timeless Indian tradition.
        </p>

        <h2>What We Offer</h2>
        <ul className="offer-list">
          <li>Hyper-realistic digital paintings of Hindu deities.</li>
          <li>Exclusive high-quality wallpapers and divine portraits.</li>
          <li>Temple-inspired art rooted in Indian tradition.</li>
          <li>Scriptural background and cultural stories for each artwork.</li>
          <li>Clean, ad-safe, and family-friendly platform.</li>
        </ul>

        <h2>Our Commitment</h2>
        <p>
          We at <strong>PauranikArt</strong> uphold integrity, respect, and devotion in every
          creation. All our artworks strictly follow cultural accuracy and devotional ethics —
          representing deities and stories with grace, purity, and reverence.
        </p>


        <h2>Join Our Journey</h2>
        <p>
          Become part of our divine vision — where art meets devotion. Follow us
          as we revive India’s spiritual heritage and share it with the world
          through digital sanctity.
        </p>

        <p className="closing">
          <strong>🕉 PauranikArt – Where Faith Meets Digital Divinity.</strong>
        </p>
      </section>
    </main>
    </>
  
  );
}
