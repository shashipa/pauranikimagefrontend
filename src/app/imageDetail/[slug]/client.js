'use client';

import { useEffect, useMemo, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css';

/**
 * Expected data:
 * {
 *  _id, imgHeading, awsImgUrl, imgDesc, imgKeyword[],
 *  downloadCount, imgArtType, godName, isPremium, likeCount, savedCount,
 *  isLive, img_slug, aspect_ratio, mediaType, imgLevel, createdAt
 * }
 */

export default function ImageDetailClient({ data }) {
  // derived
  const created = useMemo(() => {
    try { return new Date(data?.createdAt).toLocaleDateString(); } catch { return ''; }
  }, [data?.createdAt]);

  // UI state (optimistic)
  const [likes, setLikes] = useState(data?.likeCount ?? 0);
  const [saves, setSaves] = useState(data?.savedCount ?? 0);
  const [downloads, setDownloads] = useState(data?.downloadCount ?? 0);

  // comments (demo) — plug to API later
  const [comments, setComments] = useState([
    { id: 'c1', name: 'Aarav', text: 'दर्शन से हृदय में शांति और भक्ति का भाव जागा।', at: '2h' }
  ]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });

  // image protection – block right click / drag / long press save
  useEffect(() => {
    const blocker = (e) => e.preventDefault();
    const el = document.querySelector('.protect-scope');

    // context menu + drag on scope only
    el?.addEventListener('contextmenu', blocker, { passive: false });
    el?.addEventListener('dragstart', blocker, { passive: false });

    // iOS/Android long-press save prevention (disable callout)
    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';

    return () => {
      el?.removeEventListener('contextmenu', blocker);
      el?.removeEventListener('dragstart', blocker);
      document.documentElement.style.webkitTouchCallout = '';
      document.documentElement.style.webkitUserSelect = '';
    };
  }, []);

  // actions
  const onDownload = () => {
    const a = document.createElement('a');
    a.href = data.awsImgUrl;
    a.download = `${data.img_slug || 'devotional-image'}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setDownloads(n => n + 1);
    // TODO: POST /api/images/:id/download
  };

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: data.imgHeading, text: data.imgDesc, url });
      else { await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); }
    } catch {}
  };

  const onSave  = () => { setSaves(n => n + 1);  /* TODO: POST /save */ };
  const onLike  = () => { setLikes(n => n + 1);  /* TODO: POST /like */ };

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
          <main className="col-left protect-scope">
            {/* IMAGE (protected) */}
            <figure className="canvas card" aria-label="Devotional image canvas">
              {/* transparent overlay captures taps / right-clicks */}
              <span className="canvas-overlay" aria-hidden="true"></span>
              <img
                src={data.awsImgUrl}
                alt={data.imgHeading}
                className="img"
                draggable={false}
                onContextMenu={(e)=>e.preventDefault()}
              />
            </figure>

            {/* MOBILE ACTIONS — appear just below the photo */}
            <div className="mobile-actions card only-mobile">
              <h3 className="sec">Quick Actions</h3>

              <button className="btn btn-solid btn-download" onClick={onDownload}>
                <i className="bi bi-download me"></i> Download HD
                <span className="chip">{data.aspect_ratio}</span>
              </button>

              <div className="row-2 mt-2">
                <button className="btn btn-pill btn-share" onClick={onShare}>
                  <i className="bi bi-share me"></i> Share
                </button>
                <button className="btn btn-pill btn-save" onClick={onSave}>
                  <i className="bi bi-bookmark-heart me"></i> Save
                </button>
              </div>

              <button className="btn btn-solid btn-like mt-2" onClick={onLike}>
                <i className="bi bi-heart-fill me"></i> Like this Image
              </button>

              <button className="btn btn-solid btn-donate mt-2">
                <i className="bi bi-coin me"></i> Donate
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

            {/* COMMENT FORM */}
            <section className="card block">
              <h2 className="sec"><i className="bi bi-chat-heart text-gold me"></i>Leave a Devotional Comment</h2>
              <form className="c-form" onSubmit={submitComment}>
                <div className="grid-2">
                  <div>
                    <label className="f-label">Name <span className="req">*</span></label>
                    <input
                      className="f-input" required placeholder="e.g., Meera"
                      value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="f-label">Email (optional)</label>
                    <input
                      type="email" className="f-input" placeholder="name@example.com"
                      value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <label className="f-label">Your message <span className="req">*</span></label>
                  <textarea
                    rows={4} className="f-input" required
                    placeholder="Offer your thoughts, a prayer, or blessings…"
                    value={form.text} onChange={e=>setForm(f=>({...f, text:e.target.value}))}
                  />
                </div>
                <button type="submit" className="btn btn-solid btn-submit">
                  <i className="bi bi-send-heart me"></i> Post Comment
                </button>
              </form>
            </section>

            {/* COMMENTS */}
            <section className="card block">
              <div className="comments-head">
                <h2 className="sec m0"><i className="bi bi-people text-gold me"></i>Devotee Comments</h2>
                <span className="count">{comments.length}</span>
              </div>
              <div className="comments">
                {comments.map(c => (
                  <article key={c.id} className="comment">
                    <div className="avatar">{c.name.charAt(0).toUpperCase()}</div>
                    <div className="c-body">
                      <div className="row1">
                        <div className="c-name">{c.name}</div>
                        <div className="c-time">{c.at}</div>
                      </div>
                      <p className="c-text">{c.text}</p>
                    </div>
                  </article>
                ))}
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
                <a href="#" onClick={(e)=>e.preventDefault()} className="l-link">Read content license</a>
              </div>
            </div>

            <div className="card stats">
              <div className="stat"><i className="bi bi-download"></i><div><div className="s-l">Downloads</div><div className="s-v">{downloads}</div></div></div>
              <div className="stat"><i className="bi bi-heart"></i><div><div className="s-l">Likes</div><div className="s-v">{likes}</div></div></div>
              <div className="stat"><i className="bi bi-bookmark"></i><div><div className="s-l">Saves</div><div className="s-v">{saves}</div></div></div>
              <div className="stat"><i className="bi bi-activity"></i><div><div className="s-l">Status</div><div className="s-v">{data.isLive ? 'Live' : 'Hidden'}</div></div></div>
            </div>

            <div className="card section">
              <h3 className="sec">Download</h3>
              <button className="btn btn-solid btn-download" onClick={onDownload}>
                <i className="bi bi-download me"></i> Download HD <span className="chip">{data.aspect_ratio}</span>
              </button>
              <div className="sub">Ultra-HD • {data.imgLevel}</div>
            </div>

            <div className="card section">
              <h3 className="sec">Share & Save</h3>
              <div className="row-2">
                <button className="btn btn-pill btn-share" onClick={onShare}><i className="bi bi-share me"></i> Share</button>
                <button className="btn btn-pill btn-save"  onClick={onSave}><i className="bi bi-bookmark-heart me"></i> Save</button>
              </div>
              <div className="sub">Send blessings or save for puja.</div>
            </div>

            <div className="card section">
              <h3 className="sec">Show Devotion</h3>
              <button className="btn btn-solid btn-like" onClick={onLike}><i className="bi bi-heart-fill me"></i> Like this Image</button>
            </div>

            <div className="card section">
              <h3 className="sec">Support the Seva</h3>
              <button className="btn btn-solid btn-donate"><i className="bi bi-coin me"></i> Donate</button>
              <div className="sub">Helps keep sacred art free.</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
