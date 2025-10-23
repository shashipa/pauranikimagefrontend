// app/license/page.js
import "./license.css";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export const metadata = {
  title: "License & Usage Policy – PauranikArt | Devotional Use Only",
  description:
    "Read PauranikArt's official License and Usage Policy. All artworks are protected under Indian copyright laws and are for devotional and Sanatan Dharma promotion purposes only.",
  alternates: { canonical: "https://www.pauranikart.com/license" },
  openGraph: {
    title: "License & Usage Policy – PauranikArt",
    description:
      "PauranikArt images are for devotional, educational, and Sanatan Dharma awareness purposes only. Commercial duplication or reposting is strictly prohibited.",
    url: "https://www.pauranikart.com/license",
    images: [
      {
        url: "https://www.pauranikart.com/images/icon.png",
        width: 1200,
        height: 630,
        alt: "PauranikArt License Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "License & Usage Policy – PauranikArt",
    description:
      "PauranikArt artworks are protected by Indian copyright law. Use is permitted only for Sanatan Dharma promotion and personal devotion.",
    images: ["https://www.pauranikart.com/images/icon.png"],
  },
};

export default async function LicensePage() {
   const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
  return (
    <>
    <DevotionalNavbar token={token}/>
    <main className="license-wrapper">
      <section className="license-hero">
        <h1>License & Usage Policy</h1>
        <p className="subtitle">
          “Sacred art deserves sacred respect — every image is a divine creation, not a commodity.”
        </p>
      </section>

      <section className="license-content">
        <h2>1. Introduction</h2>
        <p>
          All artworks, images, and content on <strong>PauranikArt.com</strong> are the exclusive
          intellectual property of <strong>PauranikArt</strong>, protected under the{" "}
          <b>Copyright Act, 1957 (India)</b> and <b>Information Technology Act, 2000</b>.
          Unauthorized duplication, redistribution, or misuse is a punishable offense.
        </p>

        <h2>2. Permitted Use</h2>
        <p>
          PauranikArt allows limited, respectful usage of its artworks under the following
          sacred purposes only:
        </p>
        <ul>
          <li>Personal devotional use (e.g., wallpaper, meditation, bhajan background).</li>
          <li>Educational and spiritual discourses about Hindu Dharma.</li>
          <li>Social media posts promoting <b>Sanatan Dharma, Bhakti, or Indian culture</b>.</li>
          <li>Non-commercial blogs, temples, or satsang platforms with proper credit to PauranikArt.</li>
        </ul>

        <h2>3. Strictly Prohibited Uses</h2>
        <p>
          You are <b>strictly prohibited</b> from the following actions:
        </p>
        <ul>
          <li>
            Uploading or reposting PauranikArt images on commercial, stock, or photo-sharing platforms like 
            <b> Pinterest, iStock, Pexels, Unsplash, Shutterstock, Pixabay</b> or similar.
          </li>
          <li>
            Using artworks to create or promote any competing or similar website, app, or digital platform
            that hosts, sells, or distributes images.
          </li>
          <li>
            Selling, modifying, rebranding, watermarking, or using our images for resale or NFT creation.
          </li>
          <li>
            Using PauranikArt content in advertisements, videos, or posts that promote non-devotional,
            political, violent, or commercial products.
          </li>
          <li>
            Removing or obscuring the PauranikArt watermark or copyright attribution.
          </li>
        </ul>

        <h2>4. Ownership & Copyright</h2>
        <p>
          All images and artworks are created or commissioned by <b>PauranikArt</b>. Each artwork is a
          unique intellectual and spiritual creation, digitally protected. Unauthorized use will
          lead to copyright action under <b>Section 63 of the Indian Copyright Act, 1957</b>,
          punishable with imprisonment up to three years and a fine up to ₹2,00,000.
        </p>

        <h2>5. Indian Legal Framework</h2>
        <p>
          This license and usage policy complies with:
        </p>
        <ul>
          <li>
            <b>Copyright Act, 1957 (India)</b> – for ownership and reproduction rights.
          </li>
          <li>
            <b>Information Technology Act, 2000</b> – for online digital content protection.
          </li>
          <li>
            <b>IT Rules, 2021</b> – for ethical publishing and intermediary guidelines.
          </li>
        </ul>

        <p>
          Any violation of this policy may result in:
        </p>
        <ul>
          <li>Permanent ban of the violating IP address and associated accounts.</li>
          <li>Formal DMCA and legal notice under Indian law.</li>
          <li>Removal of content from third-party platforms via copyright claim.</li>
        </ul>

        <h2>6. Devotional Integrity Clause</h2>
        <p>
          Every PauranikArt image represents divine heritage. Any disrespectful use, alteration,
          or offensive presentation of deities, symbols, or spiritual icons will be treated as
          a violation of <b>religious sensitivity and cultural dignity</b> under
          <b> Article 25 of the Constitution of India</b>.
        </p>

        <h2>7. Attribution Requirement</h2>
        <p>
          When sharing or using PauranikArt images for Sanatan Dharma promotion, you must clearly
          provide credit as:
        </p>
        <blockquote>
          “Image Courtesy: PauranikArt.com — A Devotional Art Platform for Sanatan Dharma.”
        </blockquote>

        <h2>8. Reporting Misuse</h2>
        <p>
          If you come across anyone misusing our content, kindly report it immediately to:
        </p>
        <div className="contact-box">
          <p><b>Email:</b> support@pauranik.org</p>
          <p><b>Website:</b> https://www.pauranikart.com</p>
        </div>

        <h2>9. Final Note</h2>
        <p>
          By accessing or downloading from PauranikArt, you agree to honor this License Policy.
          Every image is a part of our collective spiritual heritage — handle it with the same
          reverence you would in a temple.
        </p>

        <p className="closing">
          <strong>🕉 PauranikArt – Creating. Preserving. Protecting Sanatan Dharma.</strong>
        </p>
      </section>
    </main>
    </>
   
  );
}
