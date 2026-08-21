import React, { useState } from 'react';
import { ImageOff, Sparkles, Package } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackCategory?: string;
  id?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-square',
  fallbackCategory,
  id
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fallback styling if image fails
  if (hasError || !src) {
    return (
      <div
        id={id}
        className={`relative w-full ${aspectRatio} bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4 text-center rounded-lg border border-slate-200 overflow-hidden ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 mb-2">
          <Package className="w-6 h-6 text-indigo-500" />
        </div>
        <p className="text-xs font-semibold text-slate-700 line-clamp-1 px-2">{alt}</p>
        {fallbackCategory && (
          <span className="mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-300/60 text-slate-600">
            {fallbackCategory}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectRatio} ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      )}

      <img
        id={id}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
