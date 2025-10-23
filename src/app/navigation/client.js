"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./navbar.css";

/** Saffron–to–crimson OM (flat, no shadow) */
function OmLogo({ size = 36, className = "" }) {
  return (
    <svg
      className={`om-logo ${className}`}
      style={{ width: size, height: size }}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="omGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB300"/>
          <stop offset="45%" stopColor="#F97316"/>
          <stop offset="100%" stopColor="#C81E1E"/>
        </linearGradient>
      </defs>
      <path
        fill="url(#omGrad)"
        d="M32 6c2 7 4 10 11 14-6 1-9 2-11 7-2-5-5-6-11-7 7-4 9-7 11-14zm0 23c5-7 11-7 18-6-6 5-7 9-6 15-5-2-9-1-12 3-3-4-7-5-12-3 1-6 0-10-6-15 7-1 13-1 18 6zm-14 17c7-3 11-2 14 2 3-4 7-5 14-2-7 6-16 9-28 0z"
      />
    </svg>
  );
}

export default function DevotionalNavbar({ token }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [tokendata, setToken] = useState("");
  const URL = "https://pauranikart.com/api/v1/";

  async function logoutuser() {
    try {
      const { data } = await axios.get(`${URL}user/logout`, { withCredentials: true });
      if (data?.success) {
        setToken("");
        router.push("/");
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  useEffect(() => {
    setToken(token || "");
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [token]);

  return (
    <header className={`dev-nav ${scrolled ? "scrolled" : ""}`} aria-label="Pauranikart Navigation">
      {/* top gradient line */}
      <div className="dev-nav__strip dev-nav__strip--top" />

      <nav className="dev-nav__container">
        {/* 3 columns: spacer / brand center / auth right */}
        <div className="dev-nav__grid">
          <div className="dev-nav__spacer" />

          {/* center brand */}
          <div className="dev-nav__brand">
            <Link href="/" className="dev-brand" aria-label="Pauranikart Home">
              <OmLogo size={36} />
              <span className="dev-wordmark">pauranikart</span>
            </Link>
          </div>

          {/* right actions */}
          <div className="dev-nav__actions">
            {tokendata ? (
              <button className="dev-btn dev-btn--grad" onClick={logoutuser}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="#fff" strokeWidth="2" />
                  <path d="M10 17l5-5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 12H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Log Out
              </button>
            ) : (
              <Link href="/user" className="dev-btn dev-btn--grad">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="#fff" strokeWidth="2" />
                  <path d="M10 17l5-5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 12H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* bottom gradient line */}
      <div className="dev-nav__strip dev-nav__strip--bottom" />
    </header>
  );
}
