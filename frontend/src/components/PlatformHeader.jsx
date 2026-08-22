export default function PlatformHeader({ platform, count }) {
  const isLazada = platform === 'lazada';

  return (
    <div className={`platform-header ${platform}`}>
      <div className="platform-info">
        <div className={`platform-logo-placeholder ${platform}`}>
          {isLazada ? 'L' : 'S'}
        </div>
        <div>
          <p className={`platform-name ${platform}`}>
            {isLazada ? 'Lazada' : 'Shopee'}
          </p>
          <p className="platform-count">{count} results</p>
        </div>
      </div>
      <a
        className="platform-url"
        href={isLazada ? 'https://www.lazada.com.ph' : 'https://shopee.ph'}
        target="_blank"
        rel="noopener noreferrer"
      >
        {isLazada ? 'lazada.com.ph ↗' : 'shopee.ph ↗'}
      </a>
    </div>
  );
}
