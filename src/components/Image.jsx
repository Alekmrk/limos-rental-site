import { useState, useEffect } from 'react';

const Image = ({ 
  src, 
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  imageType = 'standard',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [srcSet, setSrcSet] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const baseFilename = typeof src === 'string' 
          ? src.replace(/\.[^/.]+$/, '')
          : src?.default?.replace(/\.[^/.]+$/, '') || src?.src?.replace(/\.[^/.]+$/, '');

        // Get optimized images if they exist
        const optimizedDir = baseFilename.replace('/assets/', '/assets/optimized/');
        const imageConfig = {
          banner: [2048, 1536, 1024, 768],
          car: [800, 600, 400],
          logo: [192, 96],
          feature: [400, 200],
          standard: [800, 400]
        }[imageType] || [800, 400];

        try {
          // Try to load the smallest optimized version first as fallback
          const smallestSize = Math.min(...imageConfig);
          const fallbackPath = `${optimizedDir}-${smallestSize}.webp`;
          setImageSrc(fallbackPath);

          // Set srcset for responsive images
          const srcSetString = imageConfig
            .map(size => `${optimizedDir}-${size}.webp ${size}w`)
            .join(', ');
          setSrcSet(srcSetString);
        } catch {
          // Fallback to original image if optimized versions don't exist
          setImageSrc(typeof src === 'string' ? src : src?.default || src?.src);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      }
    };

    loadImage();
  }, [src, imageType]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = (e) => {
    // Fallback to original image on error
    if (e.target.src !== src) {
      e.target.src = typeof src === 'string' ? src : src?.default || src?.src;
    } else {
      setError(true);
    }
  };

  const combinedClassName = `
    ${className}
    ${!loaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300 ease-in-out
  `.trim();

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
    <picture>
      {srcSet && (
        <source
          type="image/webp"
          srcSet={srcSet}
          sizes={sizes}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={combinedClassName}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
};

export default Image;