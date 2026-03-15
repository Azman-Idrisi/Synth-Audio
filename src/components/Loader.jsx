import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const panelRef = useRef(null);
  const brandRef = useRef(null);
  const counterRef = useRef(null);
  const lineRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [done, setDone] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const brand = brandRef.current;
    const counter = counterRef.current;
    const line = lineRef.current;
    if (!panel || !brand || !counter || !line) return;

    const proxy = { value: 0 };
    const tl = gsap.timeline();

    // Phase 1: Count 0 → 100 over 2.5s
    tl.to(proxy, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(proxy.value);
        counter.textContent = v;
        line.style.height = `${v}vh`;
      },
    });

    // Phase 2: Brief pause
    tl.to({}, { duration: 0.3 });

    // Phase 2b: Stagger in navbar elements + reveal hero
    tl.add(() => {
      const navbarLogo = document.querySelector('.navbar-logo');
      if (navbarLogo) navbarLogo.style.opacity = '1';

      const items = document.querySelectorAll('.navbar-stagger-item');
      if (items.length) {
        gsap.fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
        );
      }

      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        gsap.to(heroContent, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      }
    });

    // Wait for navbar stagger
    tl.to({}, { duration: 0.8 });

    // Phase 3: Slide the entire panel (with brand inside) upward
    tl.to(panel, {
      y: '-100vh',
      duration: 1,
      ease: 'power3.inOut',
      onComplete: () => {
        onCompleteRef.current?.();
        setDone(true);
      },
    });

    return () => tl.kill();
  }, []);

  if (done) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        zIndex: 9999,
      }}
    >
      {/* Vertical progress line */}
      <div
        ref={lineRef}
        className="absolute bottom-0"
        style={{ left: '40px', width: '6px', height: '0vh', background: '#ff4d2e' }}
      />

      {/* Percentage counter */}
      <div
        className="absolute flex items-baseline"
        style={{ bottom: '60px', left: '80px' }}
      >
        <span
          ref={counterRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '120px',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
          }}
        >
          0
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
          }}
        >
          %
        </span>
      </div>

      {/* Brand text — inside the panel, slides up with it */}
      <span
        ref={brandRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: '42px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'white',
          whiteSpace: 'nowrap',
        }}
      >
        SYNTH AUDIO
      </span>
    </div>
  );
}
