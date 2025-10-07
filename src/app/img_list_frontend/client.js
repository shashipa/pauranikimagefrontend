'use client';

import { useMemo, useState, useEffect } from 'react';
import './page.css';

export default function BestSection({ data, initialCount = 30 }) {
  const ITEMS = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

  // pick N random unique items
  const pick = (n) => {
    if (!ITEMS.length) return [];
    const idxs = new Set();
    while (idxs.size < Math.min(n, ITEMS.length)) {
      idxs.add(Math.floor(Math.random() * ITEMS.length));
    }
    return [...idxs].map((i) => ITEMS[i]);
  };

  const [visible, setVisible] = useState(() => pick(initialCount));
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (ITEMS.length) setVisible(pick(initialCount));
  }, [ITEMS, initialCount]);

  const onLike = (item) => console.log('Liked:', item.imgHeading || item.title);
  const onSave = (item) => console.log('Saved:', item.imgHeading || item.title);

  const shuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    // let the fade/blur play
    setTimeout(() => {
      setVisible(pick(initialCount));
      // small delay for enter animation
      setTimeout(() => setIsShuffling(false), 500);
    }, 350);
  };

  return (
    <section className="best-section">
      <div className="best-header">
        <h2>Best Collections</h2>
        <a href="#" className="best-link">See all ›</a>
      </div>

      {/* Masonry container */}
      <div className={`masonry ${isShuffling ? 'is-shuffling' : ''}`}>
        {visible.map((item, i) => {
          const key = item.id || item._id || item.awsImgUrl || i;
          const img = item.awsImgUrl || item.img || item.image || item.url;
          const alt = item.title || item.godName || 'Pauranik image';
          return (
            <article className="masonry-item best-card" key={key}>
              <img className="best-img" src={img} alt={alt} loading="lazy" />
              <div className="best-controls">
                <button className="best-btn best-like" onClick={() => onLike(item)} title="Like">
                  <i className="bi bi-heart" />
                </button>
                <button className="best-btn best-save" onClick={() => onSave(item)} title="Save">
                  <i className="bi bi-bookmark" />
                </button>
                <a href={img} download className="best-btn best-download" title="Download">
                  <i className="bi bi-download" />
                </a>
              </div>
              {(item.godName || item.title) && (
                <span className="best-tag">{item.godName || item.title}</span>
              )}
            </article>
          );
        })}
      </div>

      <div className="best-actions">
        <button className={`shuffle-btn ${isShuffling ? 'loading' : ''}`} onClick={shuffle} disabled={isShuffling}>
          {isShuffling ? 'Shuffling…' : 'Shuffle Images'}
        </button>
      </div>
    </section>
  );
}
