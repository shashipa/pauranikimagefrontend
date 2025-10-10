'use client';

import { Container } from 'react-bootstrap';
import Link from 'next/link';
import './page.css';

const CATEGORIES = [
  { key: 'lordganesh',    label: 'Lord Ganesh',    img: '/ganesh.png' },
  { key: 'godessdurga',     label: 'Godess Durga',     img: '/durgaji.png' },
  { key: 'godesskali',     label: 'Godess Kaali',     img: '/kaliji.png' },
  { key: 'lordshankar',   label: 'Lord Shankar',   img: '/shankarkji.png' },
  { key: 'lordvishnu',    label: 'Lord Vishnu',    img: '/vishnuji.png' },
  { key: 'lordram',       label: 'Lord Ram',       img: '/ramji.png' },
  { key: 'lordkrishna',   label: 'Lord Krishna',   img: '/krishna.png' },
  { key: 'godesslakshmi',   label: 'Godess Lakshmi',   img: '/lakshmiji.png' },
  { key: 'godesssaraswati', label: 'Godess Saraswati', img: '/saraswatiji.png' },
  { key: 'lordhanuman',   label: 'Lord Hanuman',   img: '/hanuman.png' },
];

export default function Category_Client() {
  return (
    <section className="cat-section">
      <Container>
        <div className="cat-header">
          <h2>Popular Categories</h2>
          <Link href="#" className="cat-all">Shop all categories&nbsp;›</Link>
        </div>

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
      </Container>
    </section>
  );
}
