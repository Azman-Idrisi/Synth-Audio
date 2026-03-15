import { forwardRef } from 'react';

const CenterColumn = forwardRef(function CenterColumn({ product, heroImageRef }, ref) {
  return (
    <div className="relative flex flex-col items-center justify-center z-10" ref={ref}>
      {/* Background Heading (#3 - refined) */}
      <h1
        className="hero-heading absolute select-none pointer-events-none text-center uppercase leading-none"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(32px, 8vw, 120px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: 'rgba(255, 255, 255, 0.08)',
          filter: 'blur(1px)',
          zIndex: 0,
        }}
      >
        HEADPHONE
      </h1>

      {/* Product Spotlight (#4) */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.35,
          zIndex: 1,
        }}
      />

      {/* Soft Accent Glow */}
      <div
        className="absolute w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{
          background: product.accent,
          filter: 'blur(100px)',
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Headphone Image */}
      <img
        ref={heroImageRef}
        src={product.image}
        alt={product.name}
        className="hero-image relative w-[550px] max-w-full h-auto object-contain"
        style={{
          zIndex: 2,
          filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.4))`,
        }}
        loading="lazy"
      />

      {/* Pedestal (#5 - layered shadows) */}
      <div
        className="hero-pedestal relative mt-[-20px]"
        style={{ zIndex: 1 }}
      >
        <div
          className="w-[220px] h-[44px] rounded-[50%] mx-auto"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
            boxShadow: [
              `0 0 40px 12px ${product.accent}59`,
              `0 0 80px 24px ${product.accent}26`,
            ].join(', '),
          }}
        />
      </div>
    </div>
  );
});

export default CenterColumn;
