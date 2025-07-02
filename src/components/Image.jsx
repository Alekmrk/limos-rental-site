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
        
        if (!originalSrc || !useOptimized) {
          setImageSrc(originalSrc);
          return;
        }

        // Extract filename from the original source
        const filename = originalSrc.split('/').pop()?.replace(/\.[^/.]+$/, '');
        
        if (!filename) {
          setImageSrc(originalSrc);
          return;
        }
        
        // Get optimized images configuration based on imageType
        const imageConfig = {
          banner: [768, 1024, 1536, 2048],
          car: [400, 600, 800],
          logo: [96, 192],
          feature: [200, 400],
          standard: [400, 800]
        }[imageType] || [400, 800];

        // Try to use optimized WebP images
        try {
          // Import the optimized images dynamically to check if they exist
          const optimizedImages = await Promise.all(
            imageConfig.map(async (size) => {
              try {
                const optimizedPath = `/src/assets/optimized/${filename}-${size}.webp`;
                // Try to import the optimized image
                const module = await import(/* @vite-ignore */ optimizedPath);
                return { size, path: module.default };
              } catch {
                return null;
              }
            })
          );

          const validOptimizedImages = optimizedImages.filter(Boolean);
          
          if (validOptimizedImages.length > 0) {
            // Use the smallest optimized image as the main source
            const smallestImage = validOptimizedImages.reduce((prev, current) => 
              prev.size < current.size ? prev : current
            );
            
            setImageSrc(smallestImage.path);
            
            // Create srcset for responsive images
            const srcSetString = validOptimizedImages
              .map(img => `${img.path} ${img.size}w`)
              .join(', ');
            setSrcSet(srcSetString);
          } else {
            // No optimized images found, use original
            setUseOptimized(false);
            setImageSrc(originalSrc);
          }
        } catch (optimizedError) {
          // Fallback to original image
          setUseOptimized(false);
          setImageSrc(originalSrc);
        }
        
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      }
    };

    loadImage();
  }, [src, imageType, useOptimized]);

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