'use client';

import { Container } from 'react-bootstrap';
import Link from 'next/link';
import './cat.css';

const CATEGORIES = [
  { key: 'lordganesh',    label: 'Lord Ganesh',    img: '/ganesh.png' },
  { key: 'godessdurga',     label: 'Goddess Durga',     img: '/durgaji.png' },
  { key: 'godesskali',     label: 'Goddess Kaali',     img: '/kaliji.png' },
  { key: 'lordshankar',   label: 'Lord Shankar',   img: '/shankarkji.png' },
  { key: 'lordvishnu',    label: 'Lord Vishnu',    img: '/vishnuji.png' },
  { key: 'lordram',       label: 'Lord Ram',       img: '/ramji.png' },
  { key: 'lordkrishna',   label: 'Lord Krishna',   img: '/krishna.png' },
  { key: 'godesslakshmi',   label: 'Goddess Lakshmi',   img: '/lakshmiji.png' },
  { key: 'godesssaraswati', label: 'Goddess Saraswati', img: '/saraswatiji.png' },
  { key: 'lordhanuman',   label: 'Lord Hanuman',   img: '/hanuman.png' },
];

export default function Category_Client() {
  return (
    <>
     <div className="best-title">
          <h2>Popular Categories</h2>
        </div>

    <section className="cat-section">
        <div className="cat-grid">
          {CATEGORIES.map(c => (
            <Link key={c.key} href={`/${c.key}`} className="cat-card">
              <span className="cat-thumb">
                <img className='img_cat' src={c.img} alt={c.label} loading="lazy" />
                <span className="cat-ring" aria-hidden />
              </span>
              <span className="cat-label">{c.label}</span>
            </Link>
          ))}
        </div>
     
    </section>
    </>
  );
}
