"use client";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Decorative top glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Brand + short info */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">ॐ</span>
            <span className={styles.brandText}>Pauranikart</span>
          </Link>
          <p className={styles.tagline}>
            Pauranikart is a devotional art destination—curating divine,
            vibrant, and respectful visuals inspired by Sanatan Dharma. Explore
            wallpapers, prints, and stories crafted with love and authenticity.
          </p>
        </div>

        {/* Quick Links */}
        <nav className={styles.linkCol} aria-label="Quick Links">
          <h3 className={styles.colTitle}>Explore</h3>
          <ul className={styles.linkList}>
            <li><Link href="/aboutus" className={styles.link}>About Us</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
            <li><Link href="/license" className={styles.link}>License</Link></li>
          </ul>
        </nav>

        {/* Legal */}
        <nav className={styles.linkCol} aria-label="Legal">
          <h3 className={styles.colTitle}>Legal</h3>
          <ul className={styles.linkList}>
            <li><Link href="/terms" className={styles.link}>Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
          </ul>
        </nav>

        {/* Contact / Callout */}
        <div className={styles.contactCol}>
          <h3 className={styles.colTitle}>Get in touch</h3>
          <p className={styles.contactText}>
            Questions, feedback, or collaborations? We’d love to hear from you.
          </p>
          <a className={styles.cta} href="/contact" aria-label="Go to Contact Page">
            Contact Us
          </a>
          <div className={styles.meta}>
            <span>Made with devotion in India</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.hr} role="presentation" />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copy}>
          © {year} Pauranikart. All rights reserved.
        </p>
        <ul className={styles.bottomLinks}>
          <li><Link href="/privacy" className={styles.linkSm}>Privacy</Link></li>
          <li><Link href="/terms" className={styles.linkSm}>Terms</Link></li>
          <li><Link href="/license" className={styles.linkSm}>License</Link></li>
        </ul>
      </div>
    </footer>
  );
}
