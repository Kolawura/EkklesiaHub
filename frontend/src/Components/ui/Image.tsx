import React, { useState, useEffect } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lightSrc: string;
  darkSrc?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  srcSet?: string;
  sizes?: string;
  skeletonClassName?: string;
}

const Image: React.FC<ImageProps> = ({
  lightSrc,
  darkSrc,
  fallbackSrc = "/fallback.jpg",
  alt = "image",
  className = "",
  srcSet,
  sizes,
  skeletonClassName = "bg-gray-300 dark:bg-gray-700",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(lightSrc);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark && darkSrc) {
      setImgSrc(darkSrc);
    } else {
      setImgSrc(lightSrc);
    }
  }, [lightSrc, darkSrc]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div
          className={`absolute inset-0 animate-pulse ${skeletonClassName}`}
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        className={`object-cover w-full h-full transition-opacity duration-300 ease-in-out ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={handleError}
        srcSet={srcSet}
        sizes={sizes}
        {...props}
      />
    </div>
  );
};

export default Image;
