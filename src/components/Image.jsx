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

  useEffect(() => {
    if (typeof src === 'string') {
      setImageSrc(src);
    } else if (src && typeof src === 'object') {
      // Handle vite-transformed images
      setImageSrc(src.src || src.default);
    }
  }, [src]);

  if (!imageSrc) {
    return null;
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