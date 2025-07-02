import { useState } from 'react';

const Image = ({ 
  src, 
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  imageType = 'standard', // Custom prop - should not be passed to DOM
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = (e) => {
    console.error('Image load error for:', e.target.src);
    setError(true);
  };

  const combinedClassName = `
    ${className}
    ${!loaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300 ease-in-out
  `.trim();

  // Get the image source - handle both string and import objects
  const imageSrc = typeof src === 'string' ? src : src?.default || src?.src;

  // Filter out custom props that shouldn't be passed to the DOM element
  const { imageType: _, priority: __, ...domProps } = props;

  if (error) {
    return (
      <div 
        className={`bg-zinc-800 rounded flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg className="w-6 h-6 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div 
        className={`bg-zinc-800 animate-pulse rounded ${className}`}
        role="img"
        aria-label={`Loading ${alt}`}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={combinedClassName}
      loading={priority ? 'eager' : loading}
      onLoad={handleLoad}
      onError={handleError}
      sizes={sizes}
      {...domProps}
    />
  );
};

export default Image;