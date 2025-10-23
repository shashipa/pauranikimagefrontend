'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css';
import Link from 'next/link';
import axios from 'axios';

/* ------------ API base (fixes duplicated /api/v1/api/v1) ------------ */
const API_BASE = 'https://pauranikart.com/api/v1/api/v1';
const http = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

/** Safe filename generator */
function pickFilename(doc) {
  try {
    const base = (doc?.imgHeading || 'image')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
    return `${base || 'image'}.jpg`;
  } catch {
    return 'image.jpg';
  }
}

export default function ImageDetailClient({ data }) {
  // derived
  const created = useMemo(() => {
    try { return new Date(data?.createdAt).toLocaleDateString(); } catch { return ''; }
  }, [data?.createdAt]);

  // UI state (optimistic) — kept as-is
  const [likes, setLikes] = useState(data?.likeCount ?? 0);
  const [saves, setSaves] = useState(data?.savedCount ?? 0);
  const [downloads, setDownloads] = useState(data?.downloadCount ?? 0);

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [count, setCount] = useState({});
  const [popup, setPopup] = useState({ show: false, title: '', message: '', date: '' });

  // comments (demo) — unchanged
  const [comments, setComments] = useState([
    { id: 'c1', name: 'Aarav', text: 'दर्शन से हृदय में शांति और भक्ति का भाव जागा।', at: '2h' }
  ]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });

  /* ---------- DOM refs for cheaper event binding ---------- */
  const protectRef = useRef(null);

  /* ---------- Download: preserves your logic, adds robustness ---------- */
  const handleDownload = useCallback(async ({ data, setPopup, setDownloaded }) => {
    if (!data?._id) return;
    try {
      setDownloading(true);

      // 1) Get user IP
      const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
      const ipJson = await ipRes.json();
      const ip = ipJson?.ip || '';

      // 2) POST and expect either JSON (limit) or binary (image)
      const res = await fetch(`${API_BASE}images/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data._id, ip }),
      });

      const contentType = res.headers.get('content-type') || '';

      // Limit reached -> show popup (unchanged behavior)
      if (contentType.includes('application/json')) {
        const result = await res.json();
        if (result?.message?.includes('Download limit')) {
          setPopup({
            show: true,
            title: 'Download Limit Reached ⚠️',
            message: result.message,
            date: result.enableDate,
          });
          return;
        }
      }

      // Otherwise, treat as file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pickFilename(data);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Mark downloaded to trigger count refresh (fits your intent)
      setDownloaded?.(true);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  }, []);

  /* ---------- Image protection listeners (scoped, no querySelector) ---------- */
  useEffect(() => {
    const el = protectRef.current;
    if (!el) return;

    const blocker = (e) => e.preventDefault();
    el.addEventListener('contextmenu', blocker, { passive: false });
    el.addEventListener('dragstart', blocker, { passive: false });

    // iOS/Android long-press prevention (kept, but scoped to body instead of html)
    const bodyStyle = document.body.style;
    const prevCallout = bodyStyle.webkitTouchCallout;
    const prevUserSelect = bodyStyle.webkitUserSelect;
    bodyStyle.webkitTouchCallout = 'none';
    bodyStyle.webkitUserSelect = 'none';

    return () => {
      el.removeEventListener('contextmenu', blocker);
      el.removeEventListener('dragstart', blocker);
      bodyStyle.webkitTouchCallout = prevCallout;
      bodyStyle.webkitUserSelect = prevUserSelect;
    };
  }, []);

  /* ---------- Counts: fetch on mount and when "downloaded" flips ---------- */
  useEffect(() => {
    if (!data?._id) return;
    const controller = new AbortController();

    (async () => {
      try {
        const { data: resp } = await http.get(`images/${data._id}/count`, { signal: controller.signal });
        setCount(resp?.data || {});
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        console.error('Count fetch error:', err?.response?.data || err?.message || err);
      }
    })();

    return () => controller.abort();
  }, [data?._id, downloaded]); // re-fetch after a successful download

  // share/save/like — unchanged
  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: data.imgHeading, text: data.imgDesc, url });
      else { await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); }
    } catch {}
  };
  const onSave = () => { setSaves((n) => n + 1); /* TODO: POST /save */ };
  const onLike = () => { setLikes((n) => n + 1); /* TODO: POST /like */ };

  const submitComment = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    const newC = { id: String(Date.now()), name: form.name.trim(), text: form.text.trim(), at: 'now' };
    setComments([newC, ...comments]);
    setForm({ name: '', email: '', text: '' });
    // TODO: POST /comments
  };

  return (
    <section className="dev-wrap">
      <div className="container-xl">
        {/* Title & metadata */}
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
          {/* LEFT: main devotional stream */}
          <main className="col-left protect-scope" ref={protectRef}>
            {/* IMAGE (protected) */}
            <figure className="canvas card" aria-label="Devotional image canvas">
              <span className="canvas-overlay" aria-hidden="true" />
              <img
                src={data.awsImgUrl}
                alt={data.imgHeading}
                className="img"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                loading="lazy"
                decoding="async"
                fetchpriority="high"
              />
            </figure>

            {/* MOBILE ACTIONS */}
            <div className="mobile-actions card only-mobile">
              <h3 className="sec">Quick Actions</h3>
              <button
                style={{ cursor: 'pointer' }}
                className="btn btn-solid btn-download"
                onClick={() => handleDownload({ data, setDownloaded, setPopup })}
                disabled={downloading}
              >
                <i className="bi bi-download me"></i>
                {downloading ? 'Preparing…' : 'Download HD'}
                <span className="chip">{data.aspect_ratio}</span>
              </button>
            </div>

            {/* ABOUT */}
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

            {/* KEYWORDS */}
            {Array.isArray(data.imgKeyword) && data.imgKeyword.length > 0 && (
              <section className="card block">
                <h2 className="sec"><i className="bi bi-hash text-gold me"></i>Keywords</h2>
                <div className="tags">
                  {data.imgKeyword.map((k, i) => <span className="tag" key={i}>{k}</span>)}
                </div>
              </section>
            )}
          </main>

          {/* RIGHT: sticky action panel (desktop) */}
          <aside className="col-right only-desktop">
            <div className="card license">
              <i className="bi bi-shield-check"></i>
              <div>
                <div className="l-tt">Free for devotional use</div>
                <Link href="/license" onClick={(e) => e.preventDefault()} className="l-link">Read content license</Link>
              </div>
            </div>

            <div className="card stats">
              <div className="stat"><i className="bi bi-download"></i><div><div className="s-l">Downloads</div><div className="s-v">{count?.downloadCount ?? 0}</div></div></div>
              <div className="stat"><i className="bi bi-heart"></i><div><div className="s-l">Likes</div><div className="s-v">{count?.likedCount ?? 0}</div></div></div>
              <div className="stat"><i className="bi bi-bookmark"></i><div><div className="s-l">Saves</div><div className="s-v">{count?.savedCount ?? 0}</div></div></div>
              <div className="stat"><i className="bi bi-activity"></i><div><div className="s-l">Status</div><div className="s-v">{data.isLive ? 'Live' : 'Hidden'}</div></div></div>
            </div>

            <div className="card section">
              <h3 className="sec">Download</h3>
              <button
                style={{ cursor: 'pointer' }}
                className="btn btn-solid btn-download"
                onClick={() => handleDownload({ data, setDownloaded, setPopup })}
                disabled={downloading}
              >
                <i className="bi bi-download me"></i>
                {downloading ? 'Preparing…' : 'Download HD'}
                <span className="chip">{data.aspect_ratio}</span>
              </button>
              <div className="sub">Ultra-HD • {data.imgLevel}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* POPUP */}
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
