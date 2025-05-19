import { useState, useEffect, useRef } from 'react';

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
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

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

    if (isIntersecting) {
      loadImage();
    }
  }, [src, imageType, isIntersecting]);

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

  const generateSourceUrl = (url, format) => {
    if (url.includes('/optimized/')) {
      // Already an optimized image, just change format
      return url.replace(/\.(jpg|jpeg|png|webp)$/, `.${format}`);
    }
    // For non-optimized images, use original
    return url;
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
    <picture className={className}>
      {isIntersecting && (
        <>
          <source
            type="image/avif"
            srcSet={generateSourceUrl(src, 'avif')}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={generateSourceUrl(src, 'webp')}
            sizes={sizes}
          />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            sizes={sizes}
            {...props}
          />
        </>
      )}
    </picture>
  );
};

export default Image;