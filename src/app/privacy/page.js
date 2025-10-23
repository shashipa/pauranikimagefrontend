// app/privacy/page.js
import "./privacy.css";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";
export const metadata = {
  title: "Privacy Policy – PauranikArt | Trust, Safety & Devotion",
  description:
    "Read the Privacy Policy of PauranikArt – a divine art platform dedicated to Sanatan Dharma. We value your privacy and follow Google AdSense & data protection guidelines.",
  alternates: { canonical: "https://www.pauranikart.com/privacy" },
  openGraph: {
    title: "Privacy Policy – PauranikArt",
    description:
      "PauranikArt respects your privacy and data protection rights. Learn how we handle cookies, analytics, and AdSense responsibly.",
    url: "https://www.pauranikart.com/privacy",
    images: [
      {
        url: "https://www.pauranikart.com/images/icon.png",
        width: 1200,
        height: 630,
        alt: "PauranikArt Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – PauranikArt",
    description:
      "Understand how PauranikArt safeguards user data and ensures a safe, devotional experience for everyone.",
    images: ["https://www.pauranikart.com/images/icon.png"],
  },
};

export default async function PrivacyPage() {
   const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
  return (
   
    <>
    <DevotionalNavbar token={token}/>
     <main className="privacy-wrapper">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p className="subtitle">
          “Your trust is sacred to us — we protect it with devotion and integrity.”
        </p>
      </div>

      <section className="privacy-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>PauranikArt</strong>, a platform dedicated to divine art and the
          preservation of Sanatan Dharma through digital creativity. Your privacy
          is as sacred to us as the faith that inspires our art.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect only limited, essential information:</p>
        <ul>
          <li>Basic details like email (only if you contact us or subscribe).</li>
          <li>Analytics data such as device, browser type, and time spent.</li>
          <li>Cookies used for site preferences and ad personalization (Google AdSense).</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To enhance user experience and improve devotional content.</li>
          <li>To analyze site performance via privacy-friendly analytics.</li>
          <li>To deliver family-safe, relevant ads via Google AdSense.</li>
        </ul>

        <h2>4. Google AdSense & Cookies</h2>
        <p>
          PauranikArt uses <strong>Google AdSense</strong> to maintain the platform sustainably.
          AdSense may use cookies to display relevant ads. You can manage or disable cookies
          anytime through your browser or visit{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ad Settings
          </a>.
        </p>

        <h2>5. Data Sharing & Safety</h2>
        <p>
          We do not sell or misuse any personal data. Limited analytics data may be shared with
          secure third-party services like Google to measure site health.
        </p>

        <h2>6. Content Integrity</h2>
        <p>
          Every image and article on PauranikArt is reviewed for authenticity and devotional
          correctness. Our content is non-political, non-offensive, and fully adheres to
          <b> Google AdSense family-safe policies</b>.
        </p>

        <h2>7. Children’s Privacy</h2>
        <p>
          Our site is designed for a general audience. We do not knowingly collect information
          from anyone under 13 years of age.
        </p>

        <h2>8. Your Rights</h2>
        <ul>
          <li>Opt out of personalized advertising through browser settings.</li>
          <li>Contact us to delete or modify any data you shared.</li>
          <li>Withdraw cookie consent at any time.</li>
        </ul>

        <h2>9. Contact Us</h2>
        <p>
          For any concerns or questions regarding privacy, please contact us:
        </p>
        <div className="contact-box">
          <p><b>Email:</b> support@pauranik.org</p>
          <p><b>Website:</b> https://www.pauranikart.com</p>
        </div>

        <p className="blessing">
          <strong>🕉 May your journey be safe, sacred, and full of divine light.</strong>
        </p>
      </section>
    </main>
    </>
  );
}
