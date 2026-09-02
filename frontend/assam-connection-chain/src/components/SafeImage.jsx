import { useState, useEffect } from 'react';

/**
 * Renders a real photograph with a consistent aspect ratio, a gentle
 * loading state, and — if the network request genuinely fails — a clean
 * fallback card that names the missing photograph instead of ever
 * showing a broken-image icon or substituting a fake/generated image.
 */
export default function SafeImage({ src, alt, className = '', aspect = '4 / 3' }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // Reset state if the image source changes (e.g. navigating levels).
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <div
      className={`safe-image ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={alt}
    >
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`safe-image__img ${status === 'loaded' ? 'is-visible' : ''}`}
          onLoad={() => setStatus('loaded')}
          onError={() => {
            // eslint-disable-next-line no-console
            console.error('Missing cultural photograph:', src);
            setStatus('error');
          }}
        />
      )}

      {status === 'loading' && (
        <div className="safe-image__state safe-image__state--loading" aria-hidden="true">
          <span className="safe-image__spinner" />
        </div>
      )}

      {status === 'error' && (
        <div className="safe-image__state safe-image__state--error">
          <span className="safe-image__error-icon" aria-hidden="true">
            🖼️
          </span>
          <span>Photograph unavailable</span>
        </div>
      )}
    </div>
  );
}
