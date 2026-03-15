import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function RightColumn({ product, currentIndex, totalProducts, onPrev, onNext }) {
  const displayNumber = String(currentIndex + 1).padStart(2, '0');
  const tens = displayNumber[0];
  const units = displayNumber[1];

  const unitsRef = useRef(null);
  const prevUnitsRef = useRef(units);

  useEffect(() => {
    if (prevUnitsRef.current === units) return;
    prevUnitsRef.current = units;

    if (!unitsRef.current) return;

    gsap.fromTo(
      unitsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, [units]);

  const arrowBaseStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const handleArrowEnter = (e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.boxShadow = `0 0 20px ${product.accent}44`;
  };

  const handleArrowLeave = (e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const numberStyle = {
    WebkitTextStroke: '2px rgba(255,255,255,0.2)',
    color: 'transparent',
  };

  return (
    <div className="flex flex-col items-center md:items-end justify-center md:justify-end md:pb-0 md:mt-auto gap-6 z-10 h-full">
      {/* Product Name */}
      <div className="text-center md:text-right" style={{ fontFamily: "'Zen Dots', sans-serif" }}>
        <p className="text-white text-[28px] md:text-[32px] uppercase tracking-wider leading-tight whitespace-nowrap">
          {product.name.split(' ').slice(0, -1).join(' ')}
        </p>
        <p className="text-white/40 text-[16px] uppercase tracking-[0.2em] mt-1">
          {product.name.split(' ').slice(-1)[0]}
        </p>
      </div>

      {/* Product Number — units digit animates from bottom */}
      <div
        className="flex text-[120px] font-black text-center md:text-right leading-none select-none overflow-hidden"
        style={numberStyle}
      >
        <span>{tens}</span>
        <span ref={unitsRef} className="inline-block">{units}</span>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={arrowBaseStyle}
          onMouseEnter={handleArrowEnter}
          onMouseLeave={handleArrowLeave}
          aria-label="Previous product"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={arrowBaseStyle}
          onMouseEnter={handleArrowEnter}
          onMouseLeave={handleArrowLeave}
          aria-label="Next product"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
