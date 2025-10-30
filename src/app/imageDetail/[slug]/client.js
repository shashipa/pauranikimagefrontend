'use client';

import { useEffect, useMemo, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css';
import Link from 'next/link';
import axios from 'axios';

let URL = "https://pauranikart.com/api/v1/api/v1/";

export default function ImageDetailClient({ data }) {
  const [downloading, setDownloading] = useState(false);
  const [likes, setLikes] = useState(data?.likeCount ?? 0);
  const [saves, setSaves] = useState(data?.savedCount ?? 0);
  const [downloads, setDownloads] = useState(data?.downloadCount ?? 0);
  const [downloaded, setDownloaded] = useState(false);
  const [count, setCount] = useState({});
  const [popup, setPopup] = useState({ show: false, title: '', message: '', date: '' });
  const [comments, setComments] = useState([
    { id: 'c1', name: 'Aarav', text: 'दर्शन से हृदय में शांति और भक्ति का भाव जागा।', at: '2h' }
  ]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });

  const created = useMemo(() => {
    try {
      return new Date(data?.createdAt).toLocaleDateString();
    } catch {
      return '';
    }
  }, [data?.createdAt]);

  async function handleDownload({ data, setPopup }) {
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const ip = ipData?.ip || "";

      const res = await fetch("https://pauranikart.com/api/v1/api/v1/images/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data._id, ip }),
      });

      const contentType = res.headers.get("content-type");
      console.log(contentType);

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

  // ✅ Wrapper to show spinner and disable button
  const downloadWithIndicator = async () => {
    try {
      setDownloading(true);
      await handleDownload({ data, setDownloaded, setPopup });
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    async function getCount() {
      const imageId = data._id;
      const dataCount = await axios.get(`${URL}images/${imageId}/count`);
      setCount(dataCount?.data?.data);
      console.log(imageId + " imageId");
    }

    const blocker = (e) => e.preventDefault();
    const el = document.querySelector('.protect-scope');
    el?.addEventListener('contextmenu', blocker, { passive: false });
    el?.addEventListener('dragstart', blocker, { passive: false });

    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
    return () => {
      getCount();
      el?.removeEventListener('contextmenu', blocker);
      el?.removeEventListener('dragstart', blocker);
      document.documentElement.style.webkitTouchCallout = '';
      document.documentElement.style.webkitUserSelect = '';
    };
  }, [downloaded]);

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: data.imgHeading, text: data.imgDesc, url });
      else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      }
    } catch { }
  };

  const onSave = () => { setSaves(n => n + 1); };
  const onLike = () => { setLikes(n => n + 1); };

  const submitComment = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    const newC = { id: String(Date.now()), name: form.name.trim(), text: form.text.trim(), at: 'now' };
    setComments([newC, ...comments]);
    setForm({ name: '', email: '', text: '' });
  };

  console.log(count.downloadCount + " count");

  return (
    <section className="dev-wrap">
      <div className="container-xl">
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

            {/* Mobile download button with spinner */}
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

            {Array.isArray(data.imgKeyword) && data.imgKeyword.length > 0 && (
              <section className="card block">
                <h2 className="sec"><i className="bi bi-hash text-gold me"></i>Keywords</h2>
                <div className="tags">
                  {data.imgKeyword.map((k, i) => <span className="tag" key={i}>{k}</span>)}
                </div>
              </section>
            )}
          </main>

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
                Downloads</div><div className="s-v">{count.downloadCount}</div></div></div>
              <div className="stat"><i className="bi bi-heart"></i><div><div className="s-l">Likes</div><div className="s-v">{count.likedCount}</div></div></div>
              <div className="stat"><i className="bi bi-bookmark"></i><div><div className="s-l">Saves</div><div className="s-v">{count.savedCount}</div></div></div>
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
