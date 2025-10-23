'use client';
import './page.css';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'https://pauranikart.com/api/v1/api/v1/';

function PauranikRightHero() {
  const router = useRouter();

  // UI state
  const [query, setQuery] = useState('');
  const [godOptions, setGodOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [godName, setGodName] = useState('');
  const [imgArtType, setImgArtType] = useState('');
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Fetch facets (godName + imgArtType)
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoadingTypes(true);
        const res = await fetch(`${API_BASE}images/types`, { cache: 'no-store' });
        const data = await res.json();
        console.log(data+"from heder")
        if (!ignore && data && data.ok) {
          setGodOptions(Array.isArray(data.godNames) ? data.godNames : []);
          setStyleOptions(Array.isArray(data.imgArtTypes) ? data.imgArtTypes : []);
        }
      } catch (_) {
        // keep dropdowns empty if API fails
      } finally {
        if (!ignore) setLoadingTypes(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const onSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (godName.trim()) params.set('godName', godName.trim());
    if (imgArtType.trim()) params.set('imgArtType', imgArtType.trim());
    params.set('page', '1');
    params.set('limit', '24');
    params.set('sort', 'latest');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="hero-right">
      <div className="eyebrow">Pauranik Darshan</div>
      <h1 className="hero-title">Timeless Hindu Imagery</h1>
      <p className="hero-text">
        Sacred visuals curated for devotion, meditation, and inspiration. Experience the divine essence in every pixel with carefully crafted artworks from <span className="font-semibold">Pauranik Arts</span>.
      </p>

      <div className="cta-row">
        <button className="btn-primary" onClick={() => router.push('/categories')}>Explore Library</button>
        <button className="btn-secondary" onClick={() => router.push('/arttype')}>View Collections</button>
      </div>

      {/* form so Enter submits */}
      <form className="search-wrap" onSubmit={onSubmit}>
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search artworks, deities, collections…"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          {/* Category (Deity) = godName */}
          <div className="select-wrap">
            <select
              className="select"
              value={godName}
              onChange={(e) => setGodName(e.target.value)}
            >
              <option value="">Category (Deity)</option>
              {loadingTypes ? <option disabled>Loading…</option> : null}
              {godOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <svg className="select-caret" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .92 1.18l-4.25 3.36a.75.75 0 0 1-.92 0L5.21 8.41a.75.75 0 0 1 .02-1.2z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Style = imgArtType */}
          <div className="select-wrap">
            <select
              className="select"
              value={imgArtType}
              onChange={(e) => setImgArtType(e.target.value)}
            >
              <option value="">Style</option>
              {loadingTypes ? <option disabled>Loading…</option> : null}
              {styleOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="select-caret" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .92 1.18l-4.25 3.36a.75.75 0 0 1-.92 0L5.21 8.41a.75.75 0  1 .02-1.2z" clipRule="evenodd" />
            </svg>
          </div>

          <button type="submit" className="search-btn">Search</button>
        </div>
      </form>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-row">
          <div className="hero-left">
            <img src="/illust.png" alt="Dharmic Illustration" />
          </div>
          <PauranikRightHero />
        </div>
      </div>
    </section>
  );
}
