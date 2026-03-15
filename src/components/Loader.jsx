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

    const imageSrcs = products.map((p) => p.image);
    const total = imageSrcs.length;
    let loaded = 0;
    let displayValue = 0;

    function updateDisplay(target) {
      if (killed) return;
      gsap.to({ val: displayValue }, {
        val: target,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate() {
          displayValue = Math.round(this.targets()[0].val);
          counter.textContent = displayValue;
          line.style.height = `${displayValue}vh`;
        },
      });
    }

    function onImageDone() {
      loaded++;
      const percent = Math.round((loaded / total) * 100);
      updateDisplay(percent);

      if (loaded === total) {
        // All images loaded — ensure counter reaches 100 then run exit
        setTimeout(() => runExit(), 500);
      }
    }

    // Preload all product images
    imageSrcs.forEach((src) => {
      const img = new Image();
      img.onload = onImageDone;
      img.onerror = onImageDone;
      img.src = src;
    });

    // Minimum display time: if images load instantly, still show loader briefly
    const minTimer = setTimeout(() => {
      if (loaded === total) return; // already handled
    }, 1500);

    function runExit() {
      if (killed) return;

      // Make sure we show 100%
      gsap.to({ val: displayValue }, {
        val: 100,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          counter.textContent = v;
          line.style.height = `${v}vh`;
        },
        onComplete: () => {
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
        },
      });
    }

    return () => {
      killed = true;
      clearTimeout(minTimer);
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

      {/* Brand text */}
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
