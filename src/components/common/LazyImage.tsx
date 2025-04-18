import React, { useState, useEffect } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f5f5f5',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      setIsLoaded(true); // Чтобы убрать анимацию загрузки в случае ошибки
    };
  }, [src]);

  return (
    <div className="lazy-image-container">
      {!isLoaded && (
        <div className="lazy-image-placeholder" />
      )}
      <img
        src={src}
        alt={alt}
        className={`lazy-image ${className} ${isLoaded ? 'loaded' : ''}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
};

export default LazyImage; 