import React from 'react';

/**
 * OptimizedImage Component
 * Serves WebP format when supported, falls back to original format
 * Automatically includes lazy loading and async decoding for performance
 */
export function OptimizedImage({
  webpSrc,
  fallbackSrc,
  alt,
  className = '',
  fetchPriority = 'auto',
  loading = 'lazy',
  ...props
}) {
  return (
    <picture>
      {webpSrc && (
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
      )}
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        fetchPriority={fetchPriority}
        loading={loading}
        decoding="async"
        {...props}
      />
    </picture>
  );
}
