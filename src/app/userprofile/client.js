'use client';
import { useEffect, useState, useMemo } from 'react';

export default function Profile({ userId, email }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
let URL="https://pauranikart.com/api/v1/api/v1/"
  // Name from email (before @), prettified
  const displayName = useMemo(() => {
    if (!email) return 'User';
    const base = email.split('@')[0];
    return base
      .split(/[._\- ]+/)
      .filter(Boolean)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }, [email]);

  // Letter avatar
  const initial = (email?.[0] || 'U').toUpperCase();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${URL}user/image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (!cancelled) {
          setImages(Array.isArray(data?.imagedetail?.imageDetail) ? data.imagedetail.imageDetail : []);
        }
      } catch (e) {
        if (!cancelled) setImages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="wrap">
      {/* Header */}
      <header className="header">
        <div className="avatar">{initial}</div>
        <h1 className="name">{displayName}</h1>
      </header>

      {/* Title */}
      <div className="sectionTitle">
        <h2>Your Saved Images</h2>
        {!loading && images?.length > 0 && (
          <span className="count">{images.length}</span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">Loading…</div>
      ) : images.length === 0 ? (
        <div className="empty">
          <div className="emptyCard">
            <div className="emoji" aria-hidden>😔</div>
            <h3>You don’t have any content yet</h3>
            <p>Save images you love and they’ll appear here.</p>
            <a className="primaryLink" href="/">Explore</a>
          </div>
        </div>
      ) : (
        <section className="masonry">
          {images.map((item) => (
            <article className="pin" key={item?._id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item?.imageId?.awsImgUrl}
                alt={item?.imageId?.imgHeading || 'Saved image'}
                loading="lazy"
              />
              <button className="dlBtn" type="button">Download</button>
            </article>
          ))}
        </section>
      )}

      <style jsx>{`
        .wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 20px 56px;
        }

        /* Header */
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .avatar {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 64px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #1f6f43, #2f855a);
          box-shadow: 0 10px 30px rgba(31, 111, 67, 0.25);
        }
        .name {
          font-size: 42px;
          line-height: 1.15;
          margin: 0;
          text-align: center;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .editBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid #c7e6d6;
          background: #e8f7ef;
          color: #16603a;
          font-weight: 600;
          cursor: pointer;
          transition: transform .06s ease, box-shadow .2s ease;
        }
        .editBtn:hover { box-shadow: 0 8px 18px rgba(22, 96, 58, .2); }
        .editBtn:active { transform: translateY(1px); }

        /* Section title */
        .sectionTitle {
          display: flex;
          align-items: baseline;
          gap: 10px;
          justify-content: center;
          margin: 18px 0 10px;
        }
        .sectionTitle h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: .2px;
        }
        .count {
          font-size: 13px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 3px 8px;
          border-radius: 999px;
        }

        /* Empty state */
        .empty { display: grid; place-items: center; padding: 30px 0 60px; }
        .emptyCard {
          width: min(620px, 92%);
          text-align: center;
          padding: 32px 22px;
          background: #ffffff;
          border: 1px solid #eef2f7;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,.05);
        }
        .emoji { font-size: 42px; margin-bottom: 6px; }
        .emptyCard h3 { margin: 6px 0 8px; font-size: 20px; font-weight: 800; }
        .emptyCard p { margin: 0 0 18px; color: #6b7280; }
        .primaryLink {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 999px;
          background: #111827;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: transform .06s ease, box-shadow .2s ease, background .2s ease;
        }
        .primaryLink:hover { background: #0b1220; box-shadow: 0 10px 20px rgba(17,24,39,.25); }
        .primaryLink:active { transform: translateY(1px); }

        /* Loading */
        .loading { text-align: center; color: #6b7280; padding: 30px 0 60px; }

        /* Masonry grid */
        .masonry {
          column-count: 3;
          column-gap: 16px;
          margin-top: 8px;
        }
        @media (max-width: 1024px) { .masonry { column-count: 2; } }
        @media (max-width: 640px)  { .masonry { column-count: 1; } }

        .pin {
          display: inline-block;
          width: 100%;
          margin: 0 0 16px;
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #f3f4f6;
          box-shadow: 0 6px 14px rgba(0,0,0,.06);
        }
        .pin img {
          width: 100%;
          height: auto;
          display: block;
        }
        .dlBtn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          padding: 7px 14px;
          border: none;
          border-radius: 999px;
          background: rgba(255,255,255,.92);
          color: #111827;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 16px rgba(0,0,0,.15);
        }
        .dlBtn:hover { background: #ffffff; }
      `}</style>
    </div>
  );
}
