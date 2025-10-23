'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './art.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
let URL="https://pauranikart.com/api/v1/"
/** Toast */
const toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: '#1f1f1f',
  color: '#fff',
});

const PAGE_SIZE = 30;

const FILTERS = [
  'All',
  'Pattachitra',
  'Mithila (Madhubani)',
  'Tanjore Painting',
  'Miniature Paintings',
  'Warli Painting',
  'Kerala Murals',
  'Phad Painting',
  'Cheriyal Scrolls',
  'Kalamkari',
  'Gond Art',
  'Kalighat Painting',
  'Ajanta Cave Frescoes'
];

function ImageCard({ item, isSaved, onLike, onSave }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const img = item?.awsImgUrl || item?.img || item?.image || item?.url || '';
  const alt = item?.title || item?.imgHeading || item?.godName || 'Pauranik image';
  const slug = item?.img_slug;

  return (
    <article className="pk-card">
      {/* shimmer placeholder (visible until image resolves) */}
      {!loaded && !errored && <div className="pk-shimmer" aria-hidden="true" />}

      <img
        className={`pk-img ${loaded ? 'is-loaded' : 'is-loading'}`}
        src={img}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setErrored(true); setLoaded(true); }}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      {/* fixed-position controls */}
      <div className="pk-controls">
        <button
          className="pk-ctrl pk-like"
          title="Like"
          onClick={() => onLike(item)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <i className="bi bi-heart" />
        </button>

        {!isSaved ? (
          <button
            className="pk-ctrl pk-save"
            title="Save"
            onClick={() => onSave(item)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <i className="bi bi-bookmark" />
          </button>
        ) : (
          <span className="pk-ctrl pk-save" title="Saved" aria-label="Saved">
            <i className="bi bi-check2" />
          </span>
        )}

        <Link
          href={`imageDetail/${slug}`}
          className="pk-ctrl pk-download"
          title="Open details"
          onContextMenu={(e) => e.preventDefault()}
        >
          <i className="bi bi-download" />
        </Link>
      </div>
    </article>
  );
}

export default function Saraswati({ data, userId }) {
  const router = useRouter();

  const ITEMS = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

  // default filter
  const [active, setActive] = useState('Pattachitra');

  const filtered = useMemo(() => {
    if (active === 'All') return ITEMS;
    return ITEMS.filter(i => i?.imgArtType === active || i?.category === active);
  }, [ITEMS, active]);

  // saved images
  const [savedImages, setSavedImages] = useState(() => new Set());

  // pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [active]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  // fetch saved
  useEffect(() => {
    const fetchSaved = async () => {
      if (!userId) return;
      try {
        const res = await axios.post(`${URL}user/imag`, { userId });
        const ids = new Set();
        (res?.data?.imagedetail || []).forEach(doc => {
          (doc?.imageDetail || []).forEach(d => {
            const id = typeof d?.imageId === 'object' ? d?.imageId?._id : d?.imageId;
            if (id) ids.add(String(id));
          });
        });
        setSavedImages(ids);
      } catch (e) {
        console.error('Saved fetch failed:', e?.response?.data || e?.message || e);
      }
    };
    fetchSaved();
  }, [userId]);

  // actions
  const onLike = (item) => {
    console.log('Liked:', item?.imgHeading || item?.title || item?._id);
  };

  const onSave = async (item) => {
    try {
      if (!userId) {
        router.push('/user');
        return;
      }
      const imageId = String(item?._id || item?.id);
      if (!imageId) return;

      await axios.post(`${URL}image/save`, { userId, imageId });
      setSavedImages(prev => new Set(prev).add(imageId));
      await toast.fire({ icon: 'success', title: 'Image saved to your collection' });
    } catch (error) {
      console.error('Save failed:', error?.response?.data || error?.message || error);
      await toast.fire({ icon: 'error', title: 'Failed to save image' });
    }
  };

  // pagination helpers
  const getPageNumbers = (current, total) => {
    const pages = [];
    const windowSize = 2;
    const add = (p) => { if (p >= 1 && p <= total) pages.push(p); };
    add(1);
    for (let p = current - windowSize; p <= current + windowSize; p++) add(p);
    add(total);
    const unique = [...new Set(pages)].sort((a,b) => a-b);
    const out = [];
    for (let i=0; i<unique.length; i++) {
      const p = unique[i];
      if (i === 0) out.push(p);
      else {
        const prev = unique[i-1];
        if (p - prev === 1) out.push(p);
        else { out.push('…'); out.push(p); }
      }
    }
    return out;
  };

  const goPage = (p) => {
    if (typeof p !== 'number') return;
    if (p < 1 || p > totalPages) return;
    setPage(p);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="pk-section">
      {/* gradient heading */}
      <div className="pk-header">
        <h2 className="pk-title">Famous Painting Styles</h2>
      </div>

      {/* filters */}
      <div className="pk-filters" role="tablist" aria-label="Art style filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`pk-filter ${active === f ? 'active' : ''}`}
            onClick={() => setActive(f)}
            role="tab"
            aria-selected={active === f}
          >
            {f}
          </button>
        ))}
      </div>

      {/* content */}
      {filtered.length === 0 ? (
        <div className="pk-empty" role="status" aria-live="polite">
          <div className="pk-empty-emoji" aria-hidden="true">🖼️</div>
          <h3>No images currently for “{active}”.</h3>
          <p>Try another style filter or check back soon—new artworks arrive regularly.</p>
        </div>
      ) : (
        <>
          {/* Pinterest masonry (columns): 4 / 3 / 2 */}
          <div className="pk-masonry">
            {visible.map((item, i) => {
              const id = String(item?._id || item?.id || '');
              const isSaved = id && savedImages.has(id);
              const key = item?._id || item?.id || item?.awsImgUrl || i;
              return (
                <ImageCard
                  key={key}
                  item={item}
                  isSaved={isSaved}
                  onLike={onLike}
                  onSave={onSave}
                />
              );
            })}
          </div>

          {/* pagination */}
          <div className="pk-actions">
            <button className="pk-page" onClick={() => goPage(page - 1)} disabled={page <= 1}>
              ← Prev
            </button>

            {getPageNumbers(page, totalPages).map((p, idx) =>
              p === '…' ? (
                <span key={`dots-${idx}`} className="pk-page dots">…</span>
              ) : (
                <button
                  key={p}
                  className={`pk-page ${p === page ? 'active' : ''}`}
                  onClick={() => goPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button className="pk-page" onClick={() => goPage(page + 1)} disabled={page >= totalPages}>
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  );
}
