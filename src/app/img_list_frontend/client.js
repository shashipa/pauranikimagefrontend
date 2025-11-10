'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './list.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';

const API_BASE = 'https://pauranikart.com/api/v1/api/v1/'; // <-- fixed duplicate path

/** Reusable SweetAlert2 toast */
const toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: '#1f1f1f',
  color: '#fff',
});

function ImageCard({ item, isSaved, onSave }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const img = item?.awsImgUrl || item?.img || item?.image || item?.url || '';
  const alt = item?.title || item?.imgHeading || item?.godName || 'Pauranik image';
  const slug = item?.img_slug;

  return (
    <article className="best-card">
      {!loaded && !errored && <div className="img-shimmer" aria-hidden="true" />}

      <img
        className={`best-img ${loaded ? 'is-loaded' : 'is-loading'}`}
        src={img}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setErrored(true); setLoaded(true); }}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      <div className="best-controls">
        {!isSaved ? (
          <button
            className="best-btn save"
            onClick={() => onSave(item)}
            title="Save"
            onContextMenu={(e) => e.preventDefault()}
          >
            <i className="bi bi-bookmark" />
          </button>
        ) : (
          <span className="best-btn save" title="Saved" aria-label="Saved">
            <i className="bi bi-check2" />
          </span>
        )}

        <Link
          href={`imageDetail/${slug}`}
          className="best-btn download"
          title="Open details"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        >
          <i className="bi bi-download" />
        </Link>
      </div>
    </article>
  );
}

export default function BestSection({ initialLimit = 30, userId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read page from URL (?page=) for shareable pagination
  const urlPage = Number(searchParams.get('page') || 1);
  const [page, setPage] = useState(urlPage > 0 ? urlPage : 1);
  const [limit, setLimit] = useState(initialLimit);

  // pagination state
  const [items, setItems] = useState([]);         // current page items
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // cache pages in-memory to avoid re-fetching (page -> array)
  const pageCache = useRef(new Map()); // key: `${page}:${limit}` -> { data, totalPages, totalCount }

  // Saved image ids for this user
  const [savedImages, setSavedImages] = useState(() => new Set());

  // Update URL when page changes (for SEO/share/back/forward)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', url);
  }, [page]);

  // Fetch user’s saved images once
  useEffect(() => {
    const fetchSaved = async () => {
      if (!userId) return;
      try {
        const res = await axios.post(`${API_BASE}user/image`, { userId });
        const ids = new Set();
        (res?.data?.imagedetail || []).forEach((doc) => {
          (doc?.imageDetail || []).forEach((d) => {
            const id = typeof d?.imageId === 'object' ? d?.imageId?._id : d?.imageId;
            if (id) ids.add(String(id));
          });
        });
        setSavedImages(ids);
      } catch (e) {
        // non-blocking
        console.error('Failed to fetch saved images:', e?.response?.data || e?.message || e);
      }
    };
    fetchSaved();
  }, [userId]);

  // Build endpoint (add filters here if needed)
  const buildUrl = useCallback(
    (p, l) => {
      // Your optimized controller expects: GET /getImage?page&limit
      const u = new URL(`${API_BASE}image`);
      u.searchParams.set('page', String(p));
      u.searchParams.set('limit', String(l));
      // example filters (optional): u.searchParams.set('godName', 'Vishnu');
      return u.toString();
    },
    []
  );

  // Fetch one page (with AbortController, cache, and projection handled server-side)
  const fetchPage = useCallback(
    async (p, l) => {
      const cacheKey = `${p}:${l}`;
      if (pageCache.current.has(cacheKey)) {
        const cached = pageCache.current.get(cacheKey);
        setItems(cached.data);
        setTotalPages(cached.totalPages || 1);
        setTotalCount(cached.totalCount || 0);
        setLoading(false);
        setErr('');
        return;
      }

      setLoading(true);
      setErr('');
      const controller = new AbortController();
      const url = buildUrl(p, l);

      try {
        const res = await axios.get(url, { signal: controller.signal });
        const payload = res?.data || {};
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const tPages = Number(payload?.totalPages || 1);
        const tCount = Number(payload?.totalCount || data.length || 0);

        // fill state
        setItems(data);
        setTotalPages(tPages);
        setTotalCount(tCount);

        // cache
        pageCache.current.set(cacheKey, {
          data,
          totalPages: tPages,
          totalCount: tCount,
        });

        setLoading(false);
      } catch (e) {
        if (axios.isCancel(e)) return;
        setLoading(false);
        setErr(e?.response?.data?.message || e?.message || 'Failed to load images');
      }

      return () => controller.abort();
    },
    [buildUrl]
  );

  // Load when page/limit changes
  useEffect(() => {
    fetchPage(page, limit);
  }, [page, limit, fetchPage]);

  // Save handler
  const onSave = useCallback(
    async (item) => {
      try {
        if (!userId) {
          router.push('/user');
          return;
        }
        const imageId = String(item?._id || item?.id);
        if (!imageId) return;

        await axios.post(`${API_BASE}user/image/save`, { userId, imageId });

        setSavedImages((prev) => {
          const next = new Set(prev);
          next.add(imageId);
          return next;
        });

        await toast.fire({ icon: 'success', title: 'Image saved to your collection' });
      } catch (error) {
        console.error('Save failed:', error?.response?.data || error?.message || error);
        await toast.fire({ icon: 'error', title: 'Failed to save image' });
      }
    },
    [router, userId]
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <section className="best-section">
      <div className="best-header">
        <h2 className="best-title">Best Collections</h2>
        {/* Optional: page-size selector (kept minimal; remove if not needed) */}
        <div className="best-meta">
          {/* <span>Total: {totalCount}</span> */}
          <select
            aria-label="Images per page"
            className="best-select"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setPage(1); // reset to first page when limit changes
              setLimit(newLimit);
            }}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={30}>30</option>
            <option value={48}>48</option>
            <option value={60}>60</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {err && (
        <div className="best-error">
          <p>{err}</p>
          <button className="shuffle-btn" onClick={() => fetchPage(page, limit)}>Retry</button>
        </div>
      )}

      {/* Masonry grid */}
      <div className={`masonry ${loading ? 'is-loading' : ''}`}>
        {loading &&
          // lightweight skeletons (no heavy DOM)
          Array.from({ length: Math.min(limit, 30) }).map((_, i) => (
            <div key={`s-${i}`} className="best-card">
              <div className="img-shimmer" aria-hidden="true" />
            </div>
          ))}

        {!loading &&
          items.map((item, i) => {
            const key = item?._id || item?.id || item?.awsImgUrl || i;
            const imageId = String(item?._id || item?.id || '');
            const isSaved = imageId && savedImages.has(imageId);

            return (
              <ImageCard
                key={key}
                item={item}
                isSaved={isSaved}
                onSave={onSave}
              />
            );
          })}
      </div>

      {/* Pagination controls */}
      <div className="best-actions">
        <button
          className="shuffle-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev || loading}
          aria-disabled={!canPrev || loading}
        >
          ← Previous
        </button>

        <span className="page-indicator">
          Page {Math.min(page, totalPages)} of {Math.max(totalPages, 1)}
        </span>

        <button
          className="shuffle-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={!canNext || loading}
          aria-disabled={!canNext || loading}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
