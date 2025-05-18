import { useState, useEffect } from 'react';

const Image = ({ 
  src, 
  alt, 
  className = '', 
  sizes = '100vw',
  loading = 'lazy',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Dynamic import for the image
        const img = await import(src);
        setImageSrc(img.default);
        
        // Check if the import has multiple formats/sizes (from vite-imagetools)
        if (img.default.sources) {
          setImageInfo(img.default);
        }
      } catch (err) {
        console.error('Error loading image:', err);
      }
    };

    loadImage();
  }, [src]);

  if (!imageSrc) {
    // Optional: return a placeholder or skeleton here
    return null;
  }

  if (imageInfo?.sources) {
    return (
      <picture>
        {imageInfo.sources.map((source, index) => (
          <source
            key={index}
            srcSet={source.srcSet}
            type={source.type}
            sizes={sizes}
          />
        ))}
        <img
          src={imageInfo.img.src}
          alt={alt}
          className={className}
          loading={loading}
          {...props}
        />
      </picture>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      {...props}
    />
  );
};

export default Image;