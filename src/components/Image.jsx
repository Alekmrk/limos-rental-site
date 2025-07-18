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
  const [useOptimized, setUseOptimized] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Get the original image source
        const originalSrc = typeof src === 'string' ? src : src?.default || src?.src;
        
        // Simply use the original image source directly
        setImageSrc(originalSrc);
        setUseOptimized(false);
        
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      }
    };

    loadImage();
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = (e) => {
    console.log('Image load error for:', e.target.src);
    
    // If optimized image failed, try original
    if (useOptimized && e.target.src.includes('/optimized/')) {
      console.log('Optimized image failed, falling back to original');
      setUseOptimized(false);
      const originalSrc = typeof src === 'string' ? src : src?.default || src?.src;
      setImageSrc(originalSrc);
      setSrcSet(null);
      return;
    }
    
    setError(true);
  };

  const combinedClassName = `
    ${className}
    ${!loaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300 ease-in-out
  `.trim();

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
    <picture>
      {srcSet && useOptimized && (
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
        {...domProps}
      />
    </picture>
  );
};

export default Image;