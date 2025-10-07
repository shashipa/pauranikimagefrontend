'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import './page.css';

export default function Header_fronted_client({ data = [] }) {
  const [i, setI] = useState(0);
  let slides=data.data
  const n = slides?.length;

  const timer = useRef(null);

  useEffect(() => {
    if (!n) return;
    timer.current = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(timer.current);
  }, [n]);

  return (
    <section className="hero">
      <div className="hero-grid">
        {/* LEFT: Carousel */}
        <div className="hero-media">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`hero-slide ${idx === i ? 'active' : ''}`}
              style={{ '--img': `url(${s.awsImgUrl})` }}
            >
              <div className="hero-fill" />
              <img src={s.awsImgUrl} alt={s.godName || `slide-${idx}`} />
            </div>
          ))}

          {n > 1 && (
            <>
              <button className="hero-nav prev" onClick={() => setI((i - 1 + n) % n)}>‹</button>
              <button className="hero-nav next" onClick={() => setI((i + 1) % n)}>›</button>
              <div className="hero-dots">
                {slides.map((_, d) => (
                  <button
                    key={d}
                    className={`dot ${d === i ? 'active' : ''}`}
                    onClick={() => setI(d)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Content */}
        <div className="hero-pane">
          <span className="hero-chip">Pauranik Darshan</span>
          <h1 className="hero-title">Timeless <span>Hindu Imagery</span></h1>
          <p className="hero-sub">
            Sacred visuals curated for devotion, meditation, and inspiration.  
            Experience the divine essence in every pixel.
          </p>

          <div className="hero-ctas">
            <Button className="btn-main">Explore Library</Button>
            <Button className="btn-ghost">View Collections</Button>
          </div>

          <div className="hero-search">
            <InputGroup className="searchbar">
              <span className="icon">🔎</span>
              <Form.Control placeholder="Search artworks, deities, collections…" />
            </InputGroup>

            <div className="filters">
              <Form.Select>
                <option>Category</option>
                <option>Ramayana</option>
                <option>Mahabharata</option>
              </Form.Select>
              <Form.Select>
                <option>Style</option>
                <option>Photoreal</option>
                <option>Ravi Varma</option>
              </Form.Select>
              <Button className="search-btn">Search</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
