// app/terms/page.js
import "./terms.css";
import { cookies } from "next/headers";
import DevotionalNavbar from "../navigation/client";

export const metadata = {
  title: "Terms & Conditions – PauranikArt | Divine Art & Fair Usage Policy",
  description:
    "Read the Terms and Conditions of PauranikArt — understand how you can use our divine images, artworks, and services responsibly while respecting Sanatan Dharma and copyright law.",
  alternates: { canonical: "https://www.pauranikart.com/terms" },
  openGraph: {
    title: "Terms & Conditions – PauranikArt",
    description:
      "By accessing PauranikArt, you agree to use the platform respectfully, following copyright, AdSense, and devotional content guidelines.",
    url: "https://www.pauranikart.com/terms",
    images: [
      {
        url: "https://www.pauranikart.com/images/icon.png",
        width: 1200,
        height: 630,
        alt: "PauranikArt Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions – PauranikArt",
    description:
      "Understand your rights, usage rules, and content policy when using PauranikArt — the home of divine Hindu digital art.",
    images: ["https://www.pauranikart.com/images/icon.png"],
  },
};

export default async function TermsPage() {
   const cookieStore=cookies()
    const token=await cookieStore.get("token")?.value
    const userId= await cookieStore.get("userId")?.value
    const email=await  cookieStore.get("email")?.value
  return (
    <>
    <DevotionalNavbar token={token}/>
    <main className="terms-wrapper">
      <section className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p className="subtitle">
          “Using PauranikArt means joining a journey of faith, respect, and creativity.”
        </p>
      </section>

      <section className="terms-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>PauranikArt</strong> – a devotional art platform dedicated to
          celebrating Sanatan Dharma through digital creativity. By using our website
          (https://www.pauranikart.com), you agree to these Terms and Conditions.
          Please read them carefully before using our services.
        </p>

        <h2>2. Acceptance of Terms</h2>
        <p>
          By accessing or using PauranikArt, you confirm that you are at least 13 years old and
          agree to abide by all applicable laws, these terms, and our Privacy Policy. If you do
          not agree, please do not use the site.
        </p>

        <h2>3. Nature of Content</h2>
        <p>
          All images, artworks, and texts displayed on PauranikArt are devotional in nature and
          created with deep respect toward Hindu deities and traditions. Our goal is to
          spread awareness, spirituality, and cultural heritage — not to offend or commercialize
          religion.
        </p>

        <h2>4. Intellectual Property & Copyright</h2>
        <ul>
          <li>
            All content (images, artwork, design, code, and text) on PauranikArt is protected
            by copyright and owned or licensed by PauranikArt.
          </li>
          <li>
            You may download or share images for <b>personal, non-commercial devotional use only.</b>
          </li>
          <li>
            Reproduction, resale, redistribution, or AI re-training using our content without
            written permission is strictly prohibited.
          </li>
          <li>
            Credit to <strong>PauranikArt</strong> must be given if our images are used in any
            educational, blog, or social media content.
          </li>
        </ul>

        <h2>5. Usage Restrictions</h2>
        <ul>
          <li>Do not modify, distort, or misuse divine images or artworks.</li>
          <li>Do not upload or promote any offensive, political, or adult content.</li>
          <li>
            Do not use the website for illegal purposes, hacking, spamming, or data scraping.
          </li>
          <li>
            Users are expected to maintain a respectful attitude toward all faiths and cultures.
          </li>
        </ul>

        <h2>6. Google AdSense & Advertising</h2>
        <p>
          PauranikArt uses <b>Google AdSense</b> to serve non-intrusive, family-safe ads.
          Ads shown are based on user preferences and cookies as per Google’s policies.
          We do not control specific ad content but ensure compliance with
          <a
            href="https://support.google.com/adsense/answer/1348688"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Google Publisher Policies
          </a>.
        </p>

        <h2>7. User Accounts (if applicable)</h2>
        <p>
          If we offer registration or login services, you are responsible for maintaining
          confidentiality of your credentials. PauranikArt will never ask for your password.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          Our website may contain links to external resources or social media. We are not
          responsible for third-party content or practices. Visiting external links is
          at your own discretion.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          PauranikArt is a devotional art and information platform. We make no guarantees
          regarding uninterrupted access, specific results, or third-party service accuracy.
          We shall not be liable for any indirect, incidental, or consequential damages.
        </p>

        <h2>10. Copyright Complaints (DMCA)</h2>
        <p>
          If you believe that any content on our website infringes your copyright, please
          contact us with detailed proof at <b>support@pauranikart.com</b>.
          We act promptly in accordance with the Digital Millennium Copyright Act (DMCA).
        </p>

        <h2>11. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to our website for any
          user violating these Terms, applicable laws, or ethical guidelines.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Republic of India. Any disputes
          shall be subject to the jurisdiction of courts in Varanasi, Uttar Pradesh.
        </p>

        <h2>13. Modifications</h2>
        <p>
          PauranikArt may update these Terms from time to time. The latest version will
          always be available on this page. Continued use of the website means you accept
          the updated Terms.
        </p>

        <h2>14. Contact Us</h2>
        <div className="contact-box">
          <p><b>Email:</b> support@pauranikart.com</p>
          <p><b>Website:</b> https://www.pauranikart.com</p>
        </div>

        <p className="closing">
          <strong>🕉 PauranikArt – A Sacred Space for Divine Creativity.</strong>
        </p>
      </section>
    </main>
    </>
  );
}
