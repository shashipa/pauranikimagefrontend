'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './list.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
let URL="https://pauranikart.com/api/v1/"
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

function ImageCard({ item, isSaved, onLike, onSave }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const img = item?.awsImgUrl || item?.img || item?.image || item?.url || '';
  const alt = item?.title || item?.imgHeading || item?.godName || 'Pauranik image';
  const slug = item?.img_slug;

  return (
    <article className="best-card">
      {/* Shimmer placeholder until the image resolves */}
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

      {/* Controls: hidden by default, visible on hover */}
      <div className="best-controls">
        {/* ❤️ Like — top-left */}
        {/* <button
          className="best-btn like"
          onClick={() => onLike(item)}
          title="Like"
          onContextMenu={(e) => e.preventDefault()}
        >
          <i className="bi bi-heart" />
        </button> */}
        {/* 🔖 Save — top-right (or check if already saved) */}
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

        {/* ⬇️ Download/Open details — bottom-center */}
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

export default function BestSection({ data, initialCount = 30, userId }) {
  const router = useRouter();

  // Normalize incoming items list
  const ITEMS = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

  // Saved image ids for this user
  const [savedImages, setSavedImages] = useState(() => new Set());
  const [visible, setVisible] = useState(() => []);
  const [isShuffling, setIsShuffling] = useState(false);

  // Pick N unique random items from ITEMS
  const pick = useCallback(
    (n) => {
      if (!ITEMS.length) return [];
      const count = Math.min(n, ITEMS.length);
      const idxs = new Set();
      while (idxs.size < count) {
        idxs.add(Math.floor(Math.random() * ITEMS.length));
      }
      return [...idxs].map((i) => ITEMS[i]);
    },
    [ITEMS]
  );

  // Initialize visible items
  useEffect(() => {
    setVisible(pick(initialCount));
  }, [pick, initialCount]);

  // Fetch user’s saved images
  useEffect(() => {
    const fetchSaved = async () => {
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

      await axios.post(`${URL}user/image/save`, {
        userId,
        imageId,
      });

      // Optimistically mark as saved
      setSavedImages((prev) => {
        const next = new Set(prev);
        next.add(imageId);
        return next;
      });

      await toast.fire({
        icon: 'success',
        title: 'Image saved to your collection',
      });
    } catch (error) {
      console.error('Save failed:', error?.response?.data || error?.message || error);
      await toast.fire({
        icon: 'error',
        title: 'Failed to save image',
      });
    }
  };

  const shuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setTimeout(() => {
      setVisible(pick(initialCount));
      setTimeout(() => setIsShuffling(false), 500);
    }, 350);
  };

  return (
    <section className="best-section">
      {/* Centered gradient heading */}
      <div className="best-header">
        <h2 className="best-title">Best Collections</h2>
      </div>

      {/* Pinterest Masonry container (columns) */}
      <div className={`masonry ${isShuffling ? 'is-shuffling' : ''}`}>
        {visible.map((item, i) => {
          const key = item?._id || item?.id || item?.awsImgUrl || i;
          const imageId = String(item?._id || item?.id || '');
          const isSaved = imageId && savedImages.has(imageId);

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

      <div className="best-actions">
        <button
          className={`shuffle-btn ${isShuffling ? 'loading' : ''}`}
          onClick={shuffle}
          disabled={isShuffling}
        >
          {isShuffling ? 'Shuffling…' : 'Shuffle Images'}
        </button>
      </div>
    </section>
  );
}
