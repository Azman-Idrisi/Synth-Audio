import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import products from '../data/products';

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

    let killed = false;
    let imagesReady = false;
    let animationReady = false;

    // Preload all product images
    const imageSrcs = products.map((p) => p.image);
    const total = imageSrcs.length;
    let loaded = 0;

    function onImageDone() {
      loaded++;
      if (loaded === total) {
        imagesReady = true;
        tryExit();
      }
    }

    imageSrcs.forEach((src) => {
      const img = new Image();
      img.onload = onImageDone;
      img.onerror = onImageDone;
      img.src = src;
    });

    // Minimum 2.5s animated counter (0 → 100) regardless of load speed
    const proxy = { value: 0 };
    const counterTween = gsap.to(proxy, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (killed) return;
        const v = Math.round(proxy.value);
        counter.textContent = v;
        line.style.height = `${v}vh`;
      },
      onComplete: () => {
        animationReady = true;
        tryExit();
      },
    });

    function tryExit() {
      if (killed || !imagesReady || !animationReady) return;
      runExit();
    }

    function runExit() {
      if (killed) return;

      const exitTl = gsap.timeline();

      // Brief pause at 100%
      exitTl.to({}, { duration: 0.4 });

      // Reveal navbar and hero
      exitTl.add(() => {
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
      exitTl.to({}, { duration: 0.8 });

      // Slide panel up
      exitTl.to(panel, {
        y: '-100vh',
        duration: 1,
        ease: 'power3.inOut',
        onComplete: () => {
          onCompleteRef.current?.();
          setDone(true);
        },
      });
    }

    return () => {
      killed = true;
      counterTween.kill();
    };
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
        style={{ left: 'clamp(16px, 5vw, 40px)', width: 'clamp(4px, 1vw, 6px)', height: '0vh', background: '#ff4d2e' }}
      />

      {/* Percentage counter */}
      <div
        className="absolute flex items-baseline"
        style={{ bottom: 'clamp(30px, 8vh, 60px)', left: 'clamp(40px, 10vw, 80px)' }}
      >
        <span
          ref={counterRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(60px, 15vw, 120px)',
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
            fontSize: 'clamp(20px, 4vw, 36px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
          }}
        >
          %
        </span>
      </div>

      {/* Brand text */}
      <span
        ref={brandRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(20px, 5vw, 42px)',
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
