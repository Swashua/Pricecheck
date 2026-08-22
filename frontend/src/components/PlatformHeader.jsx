export default function PlatformHeader({ platform, count }) {
  return (
    <div className={`platform-header ${platform}`}>
      <div className="platform-info">
        <div className={`platform-logo-placeholder ${platform}`}>
          L
        </div>
        <div>
          <p className={`platform-name ${platform}`}>
            Lazada
          </p>
          <p className="platform-count">{count} results</p>
        </div>
      </div>
      <a
        className="platform-url"
        href="https://www.lazada.com.ph"
        target="_blank"
        rel="noopener noreferrer"
      >
        lazada.com.ph ↗
      </a>
    </div>
  );
}
