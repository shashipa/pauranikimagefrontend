'use client';

import { useState } from 'react';
import './page.css';

const FILTERS = ['All', 'Ganesh', 'Durga', 'Kaali', 'Shankar', 'Vishnu', 'Ram', 'Krishna', 'Lakshmi', 'Saraswati', 'Hanuman'];

const ITEMS = [
  { id: 1, category: 'Ganesh', img: 'https://picsum.photos/900/1200?1', title: 'Ganesh' },
  { id: 2, category: 'Durga', img: 'https://picsum.photos/900/1100?2', title: 'Durga' },
  { id: 3, category: 'Kaali', img: 'https://picsum.photos/900/1000?3', title: 'Kaali' },
  { id: 4, category: 'Shankar', img: 'https://picsum.photos/900/1050?4', title: 'Shankar' },
  { id: 5, category: 'Vishnu', img: 'https://picsum.photos/900/1150?5', title: 'Vishnu' },
  { id: 6, category: 'Ram', img: 'https://picsum.photos/900/980?6',  title: 'Ram' },
  { id: 7, category: 'Krishna', img: 'https://picsum.photos/900/1120?7', title: 'Krishna' },
  { id: 8, category: 'Lakshmi', img: 'https://picsum.photos/900/1080?8', title: 'Lakshmi' },
  { id: 9, category: 'Saraswati', img: 'https://picsum.photos/900/1180?9', title: 'Saraswati' },
  { id: 10, category: 'Hanuman', img: 'https://picsum.photos/900/990?10', title: 'Hanuman' },
];

export default function GalleryPage() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? ITEMS : ITEMS.filter(i => i.category === active);

  // stub actions
  const onLike = (it) => console.log('like', it.id);
  const onSave = (it) => console.log('save', it.id);

  return (
    <section className="gallery-section">
      <div className="gallery-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${active === f ? 'active' : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map(item => (
          <figure key={item.id} className="gallery-item">
            <img src={item.img} alt={item.title} loading="lazy" />

            {/* hover controls */}
            <div className="gi-controls" aria-hidden="true">
              <button className="gi-btn gi-like" title="Like" onClick={() => onLike(item)}>
                <i className="bi bi-heart"></i>
              </button>

              <button className="gi-btn gi-save" title="Save" onClick={() => onSave(item)}>
                <i className="bi bi-bookmark"></i>
              </button>

              <a
                className="gi-btn gi-download"
                title="Download"
                href={item.img}
                download
              >
                <i className="bi bi-download"></i>
              </a>
            </div>

            <figcaption className="gallery-label">{item.category}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
