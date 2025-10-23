'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
let URL="https://pauranikart.com/api/v1/api/v1/"
import './page.css'; // optional; reuse your BestSection styles if you prefer

/* ---------- Config ---------- */

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
function useQueryObject() {
  const sp = useSearchParams();
  return useMemo(() => {
    const obj = Object.fromEntries(sp.entries());
    obj.q = obj.q || '';
    obj.imgArtType = obj.imgArtType || '';
    obj.godName = obj.godName || '';
    obj.sort = obj.sort || 'latest';
    obj.page = Number(obj.page || 1);
    obj.limit = Number(obj.limit || 24);
    return obj;
  }, [sp]);
}

/** Shuffle helper for a fresh random layout each time */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* -------------------------------------------
   Search Page with random masonry + controls
-------------------------------------------- */
export default function SearchPage({ userId }) {
  console.log(userId)
  const router = useRouter();
  const query = useQueryObject();

  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState({ ok: true, total: 0, page: 1, pages: 1, count: 0, items: [] });

  // Visible (randomized) items
  const [visible, setVisible] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Saved image ids for this user
  const [savedImages, setSavedImages] = useState(() => new Set());

  // ---- Fetch search results (POST) whenever query changes
  useEffect(() => {
    let ignore = false;

    async function fetchResults() {
      try {
        setLoading(true);

        const body = {
          q: query.q,
          imgArtType: query.imgArtType,
          godName: query.godName,
          sort: query.sort,
          page: query.page,
          limit: query.limit,
        };

        const { data } = await axios.post(`${URL}images/search`, body, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!ignore) {
          setResp(data || { ok: false, items: [] });
          // randomize layout every fetch
          const items = Array.isArray(data?.items) ? data.items : [];
          setVisible(shuffleArray(items));
        }
      } catch (err) {
        if (!ignore) {
          console.error('Search error:', err?.response?.data || err?.message || err);
          setResp({ ok: false, total: 0, page: 1, pages: 1, count: 0, items: [] });
          setVisible([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchResults();
    return () => { ignore = true; };
  }, [query.q, query.imgArtType, query.godName, query.sort, query.page, query.limit]);

  // ---- Fetch saved images once userId is available (to reflect saved states)
  useEffect(() => {
    let ignore = false;
    async function fetchSaved() {
      if (!userId) return;
      try {
        const res = await axios.post(`${URL}user/image`, { userId });
        const ids = new Set();
        (res?.data?.imagedetail || []).forEach((doc) => {
          (doc?.imageDetail || []).forEach((d) => {
            const id = typeof d?.imageId === 'object' ? d?.imageId?._id : d?.imageId;
            if (id) ids.add(String(id));
          });
        });
        if (!ignore) setSavedImages(ids);
      } catch (err) {
        console.error('Failed to fetch saved images:', err?.response?.data || err?.message || err);
      }
    }
    fetchSaved();
    return () => { ignore = true; };
  }, [userId]);

  const shuffle = () => {
    if (isShuffling || !visible.length) return;
    setIsShuffling(true);
    setTimeout(() => {
      setVisible((prev) => shuffleArray(prev));
      setTimeout(() => setIsShuffling(false), 500);
    }, 350);
  };

  // ---- Actions
  const onLike = async (item) => {
    // plug your like API here if needed
    console.log('Liked:', item?._id || item?.imgHeading);
    await toast.fire({ icon: 'success', title: 'Liked this image' });
  };

  const onSave = async (item) => {
    try {
      if (!userId) {
        router.push('/user');
        return;
      }
      const imageId = String(item?._id || item?.id || '');
      if (!imageId) return;

      await axios.post(`${URL}user/image/save`, {
        userId,
        imageId,
      });

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
  };

  const onDownload = (item) => {
    // If you have a signed-URL endpoint, call it here. For now, just open the URL.
    const url = item?.awsImgUrl;
    if (url) window.open(url, '_blank', 'noopener');
  };

  // ---- Pagination handlers
  const goPage = (p) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.push(`/search?${params.toString()}`);
  };

  // ---- Optional: sorting change (if you add a dropdown in the UI)
  const setSort = (val) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', val);
    params.set('page', '1'); // reset to first page when changing sort
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="best-section">
      {/* Header (kept minimal to preserve layout harmony with your site) */}
      <div className="best-header">
        <h2>
          Results{query.q ? <> for “{query.q}”</> : ''}{query.godName ? <> · {query.godName}</> : ''}{query.imgArtType ? <> · {query.imgArtType}</> : ''}
        </h2>
        <div className="best-link">
          {loading ? 'Loading…' : `${resp.total || 0} results`}
        </div>
      </div>

      {/* Optional: Sorting dropdown (uncomment if needed) */}
      {/* <div className="sort-bar">
        <label>Sort:</label>
        <select value={query.sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="likes">Likes</option>
          <option value="downloads">Downloads</option>
          <option value="oldest">Oldest</option>
        </select>
      </div> */}

      {/* Masonry container — same class names as your BestSection */}
      <div className={`masonry ${isShuffling ? 'is-shuffling' : ''}`}>
        {loading && <div className="loader" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px 0' }}>Fetching images…</div>}

        {!loading && visible.length === 0 && (
          <div className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '24px 0' }}>
            No results found. Try different keywords or remove filters.
          </div>
        )}

        {!loading && visible.map((item, i) => {
          const key = item?._id || item?.id || item?.awsImgUrl || i;
          const img = item?.awsImgUrl || '';
          const slug = item?.img_slug;
          const alt = item?.imgHeading || item?.godName || 'Pauranik image';
          const imageId = String(item?._id || item?.id || '');
          const isSaved = imageId && savedImages.has(imageId);

          return (
            <article className="masonry-item best-card" key={key}>
              <img className="best-img" src={img} alt={alt} loading="lazy" />
              <div className="best-controls">
                {/* <button
                  className="best-btn best-like"
                  onClick={() => onLike(item)}
                  title="Like"
                >
                  <i className="bi bi-heart" />
                </button> */}

                {!isSaved ? (
                  <button
                    className="best-btn best-save"
                    onClick={() => onSave(item)}
                    title="Save"
                  >
                    <i className="bi bi-bookmark" />
                  </button>
                ) : null}

                {/* Download: opens CloudFront/S3 image (replace with your signed-URL flow if needed) */}
                <Link href={`imageDetail/${slug}`} className="best-btn best-download" title="Download">
                  <i className="bi bi-download" />
                </Link>

                {/* Detail page */}
              </div>
            </article>
          );
        })}
      </div>

      {/* Actions */}
      <div className="best-actions">
        <button
          className={`shuffle-btn ${isShuffling ? 'loading' : ''}`}
          onClick={shuffle}
          disabled={isShuffling || visible.length === 0}
        >
          {isShuffling ? 'Shuffling…' : 'Shuffle Results'}
        </button>
      </div>

      {/* Pagination */}
      {resp.pages > 1 && (
        <nav className="pager" style={{ marginTop: 20 }}>
          <button
            className="pager-btn"
            disabled={query.page <= 1}
            onClick={() => goPage(query.page - 1)}
          >
            ← Prev
          </button>
          <span className="pager-info">Page {query.page} of {resp.pages}</span>
          <button
            className="pager-btn"
            disabled={query.page >= resp.pages}
            onClick={() => goPage(query.page + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
