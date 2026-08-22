import { useState } from 'react';

export default function ProductCard({ item, platform, isCheapest, className }) {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price) => {
    if (!price) return '—';
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <a
      href={item.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`product-card ${platform} ${className || ''}`}
      id={`product-${platform}-${item.title?.slice(0, 20).replace(/\s+/g, '-')}`}
    >
      {/* Product Image */}
      <div className="product-img-wrap">
        {item.image && !imgError ? (
          <img
            className="product-img"
            src={item.image}
            alt={item.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-img-placeholder">🛍️</div>
        )}
      </div>

      {/* Details */}
      <div className="product-details">
        <p className="product-title">{item.title || 'Unknown Product'}</p>

        <p className={`product-price ${platform}`}>
          {item.priceFormatted || formatPrice(item.price)}
        </p>

        <div className="product-meta">
          {item.rating && (
            <span className="product-rating">
              ★ {Number(item.rating).toFixed(1)}
            </span>
          )}
          {item.sold && (
            <span className="product-sold">{item.sold}</span>
          )}
          {isCheapest && (
            <span className="product-badge cheapest">Lowest</span>
          )}
        </div>
      </div>

      {/* External link indicator */}
      <svg
        className="product-ext-link"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}
