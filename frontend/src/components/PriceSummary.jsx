export default function PriceSummary({ lazadaMin, shopeeMin, query }) {
  const formatPrice = (price) => {
    if (!price) return '—';
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const winner =
    lazadaMin && shopeeMin
      ? lazadaMin < shopeeMin
        ? 'lazada'
        : shopeeMin < lazadaMin
        ? 'shopee'
        : 'tie'
      : lazadaMin
      ? 'lazada'
      : shopeeMin
      ? 'shopee'
      : null;

  const savings =
    lazadaMin && shopeeMin ? Math.abs(lazadaMin - shopeeMin) : null;

  return (
    <div className="price-summary">
      {lazadaMin && (
        <div className="price-summary-item">
          <div className="price-summary-badge lazada">Lazada</div>
          <div className="price-summary-data">
            <span className="price-summary-label">Lowest Price</span>
            <span className="price-summary-value lazada">{formatPrice(lazadaMin)}</span>
          </div>
        </div>
      )}

      {lazadaMin && shopeeMin && <div className="price-summary-divider" />}

      {shopeeMin && (
        <div className="price-summary-item">
          <div className="price-summary-badge shopee">Shopee</div>
          <div className="price-summary-data">
            <span className="price-summary-label">Lowest Price</span>
            <span className="price-summary-value shopee">{formatPrice(shopeeMin)}</span>
          </div>
        </div>
      )}

      {winner && winner !== 'tie' && (
        <div className="price-winner">
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {savings ? `Save up to ${formatPrice(savings)} on` : 'Best deal on'}
          </span>
          <span className="price-winner-badge">
            {winner === 'lazada' ? '🏆 Lazada wins' : '🏆 Shopee wins'}
          </span>
        </div>
      )}

      {winner === 'tie' && (
        <div className="price-winner">
          <span className="price-winner-badge">🤝 Same lowest price</span>
        </div>
      )}
    </div>
  );
}
