'use client';

import { Container } from 'react-bootstrap';
import Link from 'next/link';
import './page.css';

const CATEGORIES = [
  { key: 'ganesh',    label: 'Ganesh',    img: 'https://images.unsplash.com/photo-1590808688691-9f3be2b4a1af?q=80&w=300&auto=format&fit=crop' },
  { key: 'durga',     label: 'Durga',     img: 'https://images.unsplash.com/photo-1720682777108-1f4e02e3b8d1?q=80&w=300&auto=format&fit=crop' },
  { key: 'kaali',     label: 'Kaali',     img: 'https://images.unsplash.com/photo-1629198735661-0d2c9a82de2d?q=80&w=300&auto=format&fit=crop' },
  { key: 'shankar',   label: 'Shankar',   img: 'https://images.unsplash.com/photo-1623186533411-d7a82b2b77d0?q=80&w=300&auto=format&fit=crop' },
  { key: 'vishnu',    label: 'Vishnu',    img: 'https://images.unsplash.com/photo-1584448097762-2c8a3a2f0d79?q=80&w=300&auto=format&fit=crop' },
  { key: 'ram',       label: 'Ram',       img: 'https://images.unsplash.com/photo-1603575449299-1f27d2c6f9a4?q=80&w=300&auto=format&fit=crop' },
  { key: 'krishna',   label: 'Krishna',   img: 'https://images.unsplash.com/photo-1603328328373-0b8a6b6cb3cf?q=80&w=300&auto=format&fit=crop' },
  { key: 'lakshmi',   label: 'Lakshmi',   img: 'https://images.unsplash.com/photo-1596003906949-67221c5e57d3?q=80&w=300&auto=format&fit=crop' },
  { key: 'saraswati', label: 'Saraswati', img: 'https://images.unsplash.com/photo-1623059391155-81a5d9d3e19f?q=80&w=300&auto=format&fit=crop' },
  { key: 'hanuman',   label: 'Hanuman',   img: 'https://images.unsplash.com/photo-1566391167880-8f4ec5590e0a?q=80&w=300&auto=format&fit=crop' },
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
            <Link key={c.key} href={`/category/${c.key}`} className="cat-card">
              <span className="cat-thumb">
                <img src={c.img} alt={c.label} loading="lazy" />
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
