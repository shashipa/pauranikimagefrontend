'use client';

import { useMemo, useState, useEffect, useCallback, useTransition, useDeferredValue } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
// ⚠️ Fix the duplicated segment:
const API_BASE = 'https://pauranikart.com/api/v1/api/v1/';
import './page.css';

/* ---------- Reusable SweetAlert2 toast ---------- */
const toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: '#1f1f1f',
  color: '#fff',
});

/* ---------- Axios instance (keeps keep-alive, timeout, smaller headers) ---------- */
const http = axios.create({
  baseURL: API_BASE,
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------- Helpers ---------- */
function useQueryObject() {
  const sp = useSearchParams();
  // Memoize derived query; useDeferredValue so UI stays responsive during rapid URL updates
  const qObj = useMemo(() => {
    const obj = Object.fromEntries(sp.entries());
    obj.q = obj.q || '';
    obj.imgArtType = obj.imgArtType || '';
    obj.godName = obj.godName || '';
    obj.sort = obj.sort || 'latest';
    obj.page = Number(obj.page || 1);
    obj.limit = Number(obj.limit || 24);
    return obj;
  }, [sp]);

  // Defer heavy work that depends on query (prevents jank during fast nav)
  const deferred = useDeferredValue(qObj);
  return deferred;
}

/** In-place Fisher–Yates on a copy (avoids allocating many arrays repeatedly) */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export default function SearchPage({ userId }) {
  const router = useRouter();
  const query = useQueryObject();
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState({ ok: true, total: 0, page: 1, pages: 1, count: 0, items: [] });

  // Visible (randomized) items
  const [visible, setVisible] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Saved image ids for this user
  const [savedImages, setSavedImages] = useState(() => new Set());

  // For low-priority state updates (keeps UI responsive)
  const [isPending, startTransition] = useTransition();

  /* ---------- Fetch search results (POST) with cancellation ---------- */
  useEffect(() => {
    let canceled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        // Minimal body (avoid sending empty strings)
        const body = {};
        if (query.q) body.q = query.q;
        if (query.imgArtType) body.imgArtType = query.imgArtType;
        if (query.godName) body.godName = query.godName;
        if (query.sort) body.sort = query.sort;
        body.page = query.page || 1;
        body.limit = query.limit || 24;

        const { data } = await http.post('images/search', body, {
          signal: controller.signal, // native cancel
        });

        if (canceled) return;

        // Use startTransition so rendering large lists doesn't block inputs
        startTransition(() => {
          const okData = data || { ok: false, items: [] };
          setResp(okData);
          const items = Array.isArray(okData?.items) ? okData.items : [];
          setVisible(shuffleArray(items)); // randomize on fetch
        });
      } catch (err) {
        if (canceled) return;
        if (axios.isCancel?.(err) || err.name === 'CanceledError' || err.name === 'AbortError') return;
        console.error('Search error:', err?.response?.data || err?.message || err);
        setResp({ ok: false, total: 0, page: 1, pages: 1, count: 0, items: [] });
        setVisible([]);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [query.q, query.imgArtType, query.godName, query.sort, query.page, query.limit]);

  /* ---------- Fetch saved images (only once userId known) ---------- */
  useEffect(() => {
    if (!userId) return;
    let canceled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await http.post('user/image', { userId }, { signal: controller.signal });
        if (canceled) return;
        const ids = new Set();
        (res?.data?.imagedetail || []).forEach((doc) => {
          (doc?.imageDetail || []).forEach((d) => {
            const id = typeof d?.imageId === 'object' ? d?.imageId?._id : d?.imageId;
            if (id) ids.add(String(id));
          });
        });
        setSavedImages(ids);
      } catch (err) {
        if (canceled) return;
        if (axios.isCancel?.(err) || err.name === 'AbortError') return;
        console.error('Failed to fetch saved images:', err?.response?.data || err?.message || err);
      }
    })();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [userId]);

  /* ---------- Handlers (memoized to avoid re-renders of list items) ---------- */
  const shuffle = useCallback(() => {
    if (isShuffling || !visible.length) return;
    setIsShuffling(true);
    // Use requestAnimationFrame to keep it silky
    requestAnimationFrame(() => {
      setVisible((prev) => shuffleArray(prev));
      // small micro delay so the CSS transition can run
      setTimeout(() => setIsShuffling(false), 300);
    });
  }, [isShuffling, visible.length]);

  const onLike = useCallback(async (item) => {
    // plug your like API here if needed
    console.log('Liked:', item?._id || item?.imgHeading);
    await toast.fire({ icon: 'success', title: 'Liked this image' });
  }, []);

  const onSave = useCallback(async (item) => {
    try {
      if (!userId) {
        router.push('/user');
        return;
      }
      const imageId = String(item?._id || item?.id || '');
      if (!imageId) return;

      await http.post('user/image/save', { userId, imageId });

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
  }, [router, userId]);

  const goPage = useCallback((p) => {
    // Prefetch target route for near-instant nav
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    const href = `/search?${params.toString()}`;
    router.prefetch(href);
    router.push(href);
  }, [router]);

  const setSort = useCallback((val) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', val);
    params.set('page', '1');
    const href = `/search?${params.toString()}`;
    router.prefetch(href);
    router.push(href);
  }, [router]);

  /* ---------- Render ---------- */
  return (
    <section className="best-section">
      <div className="best-header">
        <h2>
          Results
          {query.q ? <> for “{query.q}”</> : ''}
          {query.godName ? <> · {query.godName}</> : ''}
          {query.imgArtType ? <> · {query.imgArtType}</> : ''}
        </h2>
        <div className="best-link">
          {loading || isPending ? 'Loading…' : `${resp.total || 0} results`}
        </div>
      </div>

      {/* Optional sort control:
      <div className="sort-bar">
        <label>Sort:</label>
        <select value={query.sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="likes">Likes</option>
          <option value="downloads">Downloads</option>
          <option value="oldest">Oldest</option>
        </select>
      </div> */}

      <div className={`masonry ${isShuffling ? 'is-shuffling' : ''}`}>
        {(loading || isPending) && (
          <div className="loader" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0' }}>
            Fetching images…
          </div>
        )}

        {!loading && !isPending && visible.length === 0 && (
          <div className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '24px 0' }}>
            No results found. Try different keywords or remove filters.
          </div>
        )}

        {!loading && !isPending && visible.map((item, i) => {
          const key = item?._id || item?.id || item?.awsImgUrl || i;
          const img = item?.awsImgUrl || '';
          const slug = item?.img_slug;
          const alt = item?.imgHeading || item?.godName || 'Pauranik image';
          const imageId = String(item?._id || item?.id || '');
          const isSaved = imageId && savedImages.has(imageId);

          // Prefer smaller thumbnails via your CDN if available (e.g., ?w=600&q=75)
          const thumb = img.includes('?') ? `${img}&w=800&q=75` : `${img}?w=800&q=75`;

          return (
            <article className="masonry-item best-card" key={key}>
              {/* If you can, switch to next/image for automatic lazy, srcset, and decoding */}
              <img
                className="best-img"
                src={thumb}
                alt={alt}
                loading="lazy"
                decoding="async"
                // fetchPriority for very first few items helps LCP:
                fetchpriority={i < 3 ? 'high' : 'auto'}
              />

              <div className="best-controls">
                {/* <button className="best-btn best-like" onClick={() => onLike(item)} title="Like">
                  <i className="bi bi-heart" />
                </button> */}

                {!isSaved && (
                  <button className="best-btn best-save" onClick={() => onSave(item)} title="Save">
                    <i className="bi bi-bookmark" />
                  </button>
                )}

                {/* Detail page (fix href to absolute path) */}
                <Link href={`/imageDetail/${slug}`} className="best-btn best-download" title="Open details">
                  <i className="bi bi-download" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="best-actions">
        <button
          className={`shuffle-btn ${isShuffling ? 'loading' : ''}`}
          onClick={shuffle}
          disabled={isShuffling || visible.length === 0}
        >
          {isShuffling ? 'Shuffling…' : 'Shuffle Results'}
        </button>
      </div>

      {resp.pages > 1 && (
        <nav className="pager" style={{ marginTop: 20 }}>
          <button className="pager-btn" disabled={query.page <= 1} onClick={() => goPage(query.page - 1)}>
            ← Prev
          </button>
          <span className="pager-info">Page {query.page} of {resp.pages}</span>
          <button className="pager-btn" disabled={query.page >= resp.pages} onClick={() => goPage(query.page + 1)}>
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
