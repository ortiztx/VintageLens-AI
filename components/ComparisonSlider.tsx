
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  original: string;
  restored: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, restored }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] md:aspect-video overflow-hidden rounded-xl cursor-col-resize select-none shadow-2xl bg-neutral-900 border border-white/10"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Restored Image (Background) */}
      <img 
        src={restored} 
        alt="Restored" 
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Original Image (Foreground - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={original} 
          alt="Original" 
          className="w-full h-full object-contain grayscale-[0.5] brightness-75"
        />
      </div>

      {/* Slider Bar */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl flex items-center justify-center"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg -translate-x-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 8 4 4-4 4M6 8l-4 4 4 4"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white border border-white/20">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white border border-white/20">
        Restored
      </div>
    </div>
  );
};

export default ComparisonSlider;
