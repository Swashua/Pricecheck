import { useState, useCallback } from 'react';
import SearchIcon from './components/SearchIcon';
import ProductCard from './components/ProductCard';
import LoadingState from './components/LoadingState';
import PlatformHeader from './components/PlatformHeader';
import Particles from './components/Particles';

const SUGGESTIONS = ['iPhone 15', 'Gaming laptop', 'Air fryer', 'Mechanical keyboard', 'Sneakers', 'Smart watch'];

const SORT_OPTIONS = [
  { key: 'default', label: 'Relevance' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
  { key: 'rating', label: 'Rating' },
];

function sortItems(items, sortKey) {
  if (!items) return [];
  const arr = [...items];
  if (sortKey === 'price_asc') return arr.sort((a, b) => a.price - b.price);
  if (sortKey === 'price_desc') return arr.sort((a, b) => b.price - a.price);
  if (sortKey === 'rating') return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return arr;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState('default');
  const [searched, setSearched] = useState('');

  const handleSearch = useCallback(async (q) => {
    const searchQuery = (q || query).trim();
    if (!searchQuery || loading) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSearched(searchQuery);
    setSortKey('default');

    try {
      const res = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to backend. Make sure the server is running on port 3001.');
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }, [query, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const lazadaItems = sortItems(results?.lazada, sortKey);

  const lazadaMin = results?.lazada?.length ? Math.min(...results.lazada.map(i => i.price).filter(p => p > 0)) : null;

  const totalCount = results?.lazada?.length || 0;

  return (
    <div className="app">
      <Particles />
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="dot" />
          Philippines · Live Price Checker
        </div>
        <h1>
          <span className="brand-lazada">Lazada</span> Price Tracker
        </h1>
        <p className="hero-sub">
          Search any product and instantly find the best prices, ratings, and deals from Lazada.
        </p>

        <div className="search-wrap">
          <form className="search-form" onSubmit={handleSubmit} id="search-form">
            <div className="search-input-wrap">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="search-input"
                className="search-input"
                type="text"
                placeholder="Search products, brands, categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              id="search-button"
              className="search-btn"
              type="submit"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Searching…
                </>
              ) : (
                <>Search</>
              )}
            </button>
          </form>

          <div className="search-suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => { setQuery(s); handleSearch(s); }}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar (when no search) */}
      {!results && !loading && !error && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">Live</span>
            <span className="stat-label">Data</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">PH</span>
            <span className="stat-label">Region</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">₱ PHP</span>
            <span className="stat-label">Currency</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingState query={searched} />}

      {/* Error */}
      {error && !loading && (
        <div className="results-section">
          <div className="container">
            <div className="empty-state" style={{ maxWidth: 500, margin: '0 auto' }}>
              <div className="empty-icon">⚠️</div>
              <div className="empty-title">Something went wrong</div>
              <div className="empty-sub">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <section className="results-section">
          {/* Controls */}
          <div className="results-header">
            <p className="results-title">
              Found <strong>{totalCount} results</strong> for &quot;<strong>{searched}</strong>&quot;
            </p>
            <div className="sort-controls">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={`sort-btn ${sortKey === opt.key ? 'active' : ''}`}
                  onClick={() => setSortKey(opt.key)}
                  id={`sort-${opt.key}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="columns-wrap" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
            {/* Lazada */}
            <div className="platform-column">
              <PlatformHeader platform="lazada" count={lazadaItems.length} />
              {lazadaItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-title">No Lazada results</div>
                  <div className="empty-sub">Lazada may have blocked the request. Try again.</div>
                </div>
              ) : (
                lazadaItems.map((item, i) => (
                  <ProductCard
                    key={`lazada-${i}`}
                    item={item}
                    platform="lazada"
                    isCheapest={item.price === lazadaMin}
                    className="animate-in"
                  />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          PriceCheck PH · Data scraped live from lazada.com.ph · For personal use only
        </p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
