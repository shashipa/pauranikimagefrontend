"use client";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <div className={styles.glow} aria-hidden="true" />

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.icon}>ॐ</div>
          <h1 className={styles.title}>Contact Pauranikart</h1>
          <p className={styles.text}>
            For any queries, feedback, or collaborations, feel free to reach out
            to us with devotion and love.
          </p>
          <a href="mailto:support@pauranik.org" className={styles.mail}>
            support@pauranik.org
          </a>
          <p className={styles.note}>
            Our team will get back to you within 24–48 hours. Thank you for being
            part of the <strong>Pauranik</strong> family.
          </p>
        </div>
      </section>
    </main>
  );
}
