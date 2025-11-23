'use client';

import { useEffect, useMemo, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css'; // Ensure this file exists in the same folder
import Link from 'next/link';
import axios from 'axios';

// Base URL for API
const API_BASE_URL = "https://pauranikart.com/api/v1/api/v1/";

export default function ImageDetailClient({ data }) {
  const [downloading, setDownloading] = useState(false);
  const [likes, setLikes] = useState(data?.likeCount ?? 0);
  const [saves, setSaves] = useState(data?.savedCount ?? 0);
  // Note: 'downloads' state variable was unused in your UI (you used count.downloadCount), but keeping if needed
  const [downloads, setDownloads] = useState(data?.downloadCount ?? 0);
  const [downloaded, setDownloaded] = useState(false);
  const [count, setCount] = useState({});
  const [popup, setPopup] = useState({ show: false, title: '', message: '', date: '' });
  
  // Comment system (Frontend only demo based on your code)
  const [comments, setComments] = useState([
    { id: 'c1', name: 'Aarav', text: 'दर्शन से हृदय में शांति और भक्ति का भाव जागा।', at: '2h' }
  ]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });

  // Format date
  const created = useMemo(() => {
    try {
      return new Date(data?.createdAt).toLocaleDateString();
    } catch {
      return '';
    }
  }, [data?.createdAt]);

  // --- Download Logic ---
  async function handleDownload({ data, setPopup }) {
    try {
      // Get IP for limit checking
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const ip = ipData?.ip || "";

      const res = await fetch(`${API_BASE_URL}images/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data._id, ip }),
      });

      const contentType = res.headers.get("content-type");

      // Check for API limit message (JSON response)
      if (contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result?.message?.includes("Download limit")) {
          setPopup({
            show: true,
            title: "Download Limit Reached ⚠️",
            message: result.message,
            date: result.enableDate,
          });
          return;
        }
      }

      // Handle Blob (Image) response
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.imgHeading || "image"}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  }

  // Wrapper to show spinner and disable button
  const downloadWithIndicator = async () => {
    try {
      setDownloading(true);
      await handleDownload({ data, setDownloaded, setPopup });
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    async function getCount() {
      if (!data?._id) return;
      try {
        const dataCount = await axios.get(`${API_BASE_URL}images/${data._id}/count`);
        setCount(dataCount?.data?.data || {});
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    }

    // Prevent right click / drag (Content Protection)
    const blocker = (e) => e.preventDefault();
    const el = document.querySelector('.protect-scope');
    el?.addEventListener('contextmenu', blocker, { passive: false });
    el?.addEventListener('dragstart', blocker, { passive: false });
    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';

    // Call Count immediately
    getCount();

    return () => {
      el?.removeEventListener('contextmenu', blocker);
      el?.removeEventListener('dragstart', blocker);
      document.documentElement.style.webkitTouchCallout = '';
      document.documentElement.style.webkitUserSelect = '';
    };
  }, [data._id, downloaded]);

  return (
    <section className="dev-wrap">
      <div className="container-xl">
        
        {/* Header Area */}
        <header className="head">
          <h1 className="title">{data.imgHeading}</h1>
          <div className="meta-pills">
            <span className="pill pill-gold">{data.godName}</span>
            <span className="pill">{data.mediaType}</span>
            <span className="pill">{data.imgArtType}</span>
            <span className="pill">AR {data.aspect_ratio}</span>
            <span className={`pill ${data.isPremium ? 'pill-premium' : 'pill-free'}`}>
              {data.isPremium ? 'Premium' : 'Free'}
            </span>
            <span className="meta-note">Published: {created}</span>
          </div>
        </header>

        <div className="grid">
          {/* Left Column (Image & Mobile Buttons) */}
          <main className="col-left protect-scope">
            <figure className="canvas card" aria-label="Devotional image canvas">
              <span className="canvas-overlay" aria-hidden="true"></span>
              <img
                src={data.awsImgUrl}
                alt={data.imgHeading}
                className="img"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </figure>

            {/* Mobile download button */}
            <div className="mobile-actions card only-mobile">
              <h3 className="sec">Quick Actions</h3>
              <button
                style={{ cursor: "pointer" }}
                className="btn btn-solid btn-download"
                onClick={downloadWithIndicator}
                disabled={downloading}
              >
                <i className={`bi ${downloading ? 'bi-arrow-repeat spin' : 'bi-download'} me`}></i>
                {downloading ? 'Downloading…' : 'Download HD'}
                <span className="chip">{data.aspect_ratio}</span>
              </button>
            </div>

            {/* Description */}
            <section className="card block">
              <h2 className="sec"><i className="bi bi-flower2 text-gold me"></i>About this Image</h2>
              <p className="lead">{data.imgDesc}</p>
              <div className="about-grid">
                <div><div className="label">Deity</div><div className="value">{data.godName}</div></div>
                <div><div className="label">Art Style</div><div className="value">{data.imgArtType}</div></div>
                <div><div className="label">Aspect Ratio</div><div className="value">{data.aspect_ratio}</div></div>
                <div><div className="label">Quality</div><div className="value chip-lite">{data.imgLevel}</div></div>
              </div>
            </section>

            {/* Keywords */}
            {Array.isArray(data.imgKeyword) && data.imgKeyword.length > 0 && (
              <section className="card block">
                <h2 className="sec"><i className="bi bi-hash text-gold me"></i>Keywords</h2>
                <div className="tags">
                  {data.imgKeyword.map((k, i) => <span className="tag" key={i}>{k}</span>)}
                </div>
              </section>
            )}
          </main>

          {/* Right Column (Desktop Sidebar) */}
          <aside className="col-right only-desktop">
            <div className="card license">
              <i className="bi bi-shield-check"></i>
              <div>
                <div className="l-tt">Free for devotional use</div>
                <Link href="/license" onClick={(e) => e.preventDefault()} className="l-link">Read content license</Link>
              </div>
            </div>

            <div className="card stats">
              <div className="stat"><i className="bi bi-download"></i><div><div className="s-l">
                Downloads</div><div className="s-v">{count.downloadCount || 0}</div></div></div>
              <div className="stat"><i className="bi bi-heart"></i><div><div className="s-l">Likes</div><div className="s-v">{count.likedCount || 0}</div></div></div>
              <div className="stat"><i className="bi bi-bookmark"></i><div><div className="s-l">Saves</div><div className="s-v">{count.savedCount || 0}</div></div></div>
              <div className="stat"><i className="bi bi-activity"></i><div><div className="s-l">Status</div><div className="s-v">{data.isLive ? 'Live' : 'Hidden'}</div></div></div>
            </div>

            <div className="card section">
              <h3 className="sec">Download</h3>
              <button
                style={{ cursor: "pointer" }}
                className="btn btn-solid btn-download"
                onClick={downloadWithIndicator}
                disabled={downloading}
              >
                <i className={`bi ${downloading ? 'bi-arrow-repeat spin' : 'bi-download'} me`}></i>
                {downloading ? 'Downloading…' : 'Download HD'}
                <span className="chip">{data.aspect_ratio}</span>
              </button>
              <div className="sub">Ultra-HD • {data.imgLevel}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Popup for download limit */}
      {popup.show && (
        <div className="popup-overlay" onClick={() => setPopup({ ...popup, show: false })}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="popup-title">{popup.title}</h2>
            <p className="popup-msg">{popup.message}</p>
            {popup.date && <p className="popup-date">You can download again after: {popup.date}</p>}
            <button className="popup-btn" onClick={() => setPopup({ ...popup, show: false })}>
              Okay
            </button>
          </div>
        </div>
      )}
    </section>
  );
}