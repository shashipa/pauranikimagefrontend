'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';

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

const PAGE_SIZE = 30; // <-- fixed 30 items per page

export default function Lakshmi({ data, initialCount = 30, userId }) {
  const router = useRouter();

  // Normalize incoming items list
  const ITEMS = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

  // Saved image ids for this user
  const [savedImages, setSavedImages] = useState(() => new Set());

  // Pagination state
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ITEMS.length / PAGE_SIZE));

  // Current page items
  const [visible, setVisible] = useState([]);

  // Initialize/Update visible items when ITEMS or page change
  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setVisible(ITEMS.slice(start, end));
  }, [ITEMS, page]);

  // If data source changes and current page goes out of range, clamp it
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // Fetch user’s saved images once userId is available
  useEffect(() => {
    const fetchSaved = async () => {
      if (!userId) return;
      try {
        const res = await axios.post('http://localhost:7001/api/v1/user/image', { userId });

        // Expect imagedetail = [ { imageDetail: [ { imageId: <id or populated obj> }, ... ] }, ... ]
        const ids = new Set();
        (res?.data?.imagedetail || []).forEach((doc) => {
          (doc?.imageDetail || []).forEach((d) => {
            const id = typeof d?.imageId === 'object' ? d?.imageId?._id : d?.imageId;
            if (id) ids.add(String(id));
          });
        });
        setSavedImages(ids);
      } catch (err) {
        console.error('Failed to fetch saved images:', err?.response?.data || err?.message || err);
      }
    };
    fetchSaved();
  }, [userId]);

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

      await axios.post('http://localhost:7001/api/v1/user/image/save', {
        userId,
        imageId,
      });

      // Optimistically mark as saved
      setSavedImages((prev) => {
        const next = new Set(prev);
        next.add(imageId);
        return next;
      });

      // Success toast
      await toast.fire({
        icon: 'success',
        title: 'Image saved to your collection',
      });
    } catch (error) {
      console.error('Save failed:', error?.response?.data || error?.message || error);

      // Error toast
      await toast.fire({
        icon: 'error',
        title: 'Failed to save image',
      });
    }
  };

  // ----- Pagination helpers (1, 2, 3, … last) -----
  const getPageNumbers = (current, total) => {
    const pages = [];
    const windowSize = 2; // show current-2 .. current+2

    const add = (p) => {
      if (p >= 1 && p <= total) pages.push(p);
    };

    add(1);
    for (let p = current - windowSize; p <= current + windowSize; p++) add(p);
    add(total);

    // Deduplicate and sort
    const unique = [...new Set(pages)].sort((a, b) => a - b);

    // Insert ellipses
    const result = [];
    for (let i = 0; i < unique.length; i++) {
      const p = unique[i];
      if (i === 0) {
        result.push(p);
      } else {
        const prev = unique[i - 1];
        if (p - prev === 1) {
          result.push(p);
        } else {
          result.push('…');
          result.push(p);
        }
      }
    }
    return result;
  };

  const goPage = (p) => {
    if (typeof p !== 'number') return;
    if (p < 1 || p > totalPages) return;
    setPage(p);
    // scroll to top for better UX
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="best-section">
      <div className="best-header">
        <h2>Best Collections</h2>
      </div>

      {/* Masonry container */}
      <div className="masonry">
        {visible.map((item, i) => {
          const key = item?._id || item?.id || item?.awsImgUrl || i;
          const img = item?.awsImgUrl || item?.img || item?.image || item?.url || '';
          const slug = item?.img_slug;
          const alt = item?.title || item?.imgHeading || item?.godName || 'Pauranik image';
          const imageId = String(item?._id || item?.id || '');
          const isSaved = imageId && savedImages.has(imageId);

          return (
            <article className="masonry-item best-card" key={key}>
              <img className="best-img" src={img} alt={alt} loading="lazy" />
              <div className="best-controls">
                <button
                  className="best-btn best-like"
                  onClick={() => onLike(item)}
                  title="Like"
                >
                  <i className="bi bi-heart" />
                </button>

                {!isSaved ? (
                  <button
                    className="best-btn best-save"
                    onClick={() => onSave(item)}
                    title="Save"
                  >
                    <i className="bi bi-bookmark" />
                  </button>
                ) : ("")}

                <Link href={`imageDetail/${slug}`} className="best-btn best-download" title="Download">
                  <i className="bi bi-download" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="best-actions" style={{ gap: 8, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="shuffle-btn"
          onClick={() => goPage(page - 1)}
          disabled={page <= 1}
        >
          ← Prev
        </button>

        {getPageNumbers(page, totalPages).map((p, idx) =>
          p === '…' ? (
            <span key={`dots-${idx}`} className="shuffle-btn" style={{ pointerEvents: 'none', opacity: 0.6 }}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`shuffle-btn ${p === page ? 'loading' : ''}`}
              onClick={() => goPage(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="shuffle-btn"
          onClick={() => goPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
