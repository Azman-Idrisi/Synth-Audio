import { useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import products from '../data/products';

const allSwatches = products.map((p) => p.accent);

export default function LeftColumn({ product, currentIndex, onSwatchClick, cartIconRef, heroImageRef, onAddToCart }) {
  const btnWrapRef = useRef(null);
  const btnRef = useRef(null);
  const btnGlowRef = useRef(null);
  const btnTextRef = useRef(null);
  const btnArrowRef = useRef(null);
  const spinnerRef = useRef(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleBtnMouseMove = useCallback((e) => {
    if (!btnWrapRef.current) return;
    const rect = btnWrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btnWrapRef.current, {
      x: x * 0.12,
      y: y * 0.12,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleBtnEnter = useCallback(() => {
    if (isAddingToCart) return;
    if (btnGlowRef.current) {
      gsap.to(btnGlowRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
    }
    if (btnArrowRef.current) {
      gsap.to(btnArrowRef.current, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
    if (btnTextRef.current) {
      gsap.to(btnTextRef.current, { x: -6, duration: 0.35, ease: 'power2.out' });
    }
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 1.05,
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isAddingToCart]);

  const handleBtnLeave = useCallback(() => {
    if (isAddingToCart) return;
    if (!btnWrapRef.current) return;
    gsap.to(btnWrapRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
    if (btnGlowRef.current) {
      gsap.to(btnGlowRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' });
    }
    if (btnArrowRef.current) {
      gsap.to(btnArrowRef.current, { x: -8, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
    if (btnTextRef.current) {
      gsap.to(btnTextRef.current, { x: 0, duration: 0.3, ease: 'power2.in' });
    }
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 1,
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isAddingToCart]);

  const handleAddToCart = useCallback(() => {
    if (isAddingToCart) return;
    if (!btnRef.current || !btnTextRef.current) return;

    setIsAddingToCart(true);

    const btn = btnRef.current;
    const btnText = btnTextRef.current;
    const spinner = spinnerRef.current;
    const arrow = btnArrowRef.current;
    const cartIcon = cartIconRef?.current;
    const heroImage = heroImageRef?.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          gsap.to(btn, {
            background: 'rgba(255,255,255,0.12)',
            borderColor: 'rgba(255,255,255,0.25)',
            duration: 0.3,
            ease: 'power2.out',
          });
          btnText.textContent = 'ADD TO CART';
          gsap.to(btnText, { opacity: 1, duration: 0.3 });
          if (arrow) gsap.set(arrow, { display: '' });
          btn.style.width = '';
          setIsAddingToCart(false);
        }, 1500);
      },
    });

    // Step 1: Button press feedback
    tl.to(btn, {
      scale: 0.92,
      duration: 0.12,
      ease: 'power2.out',
    });
    tl.to(btn, {
      scale: 1,
      duration: 0.12,
      ease: 'power2.out',
    });

    // Step 2: Button morph — shrink width, fade text, show spinner
    const btnRect = btn.getBoundingClientRect();
    tl.to(btn, {
      width: btnRect.width * 0.7,
      duration: 0.3,
      ease: 'power2.inOut',
    });
    tl.to(btnText, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        btnText.textContent = '';
        if (arrow) gsap.set(arrow, { display: 'none' });
        if (spinner) {
          spinner.style.display = 'block';
          gsap.fromTo(spinner, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.2 });
        }
      },
    }, '<');

    // Hold spinner briefly
    tl.to({}, { duration: 0.5 });

    // Step 3: Product fly animation
    if (heroImage && cartIcon) {
      tl.add(() => {
        const imgRect = heroImage.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const clone = heroImage.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${imgRect.left}px`;
        clone.style.top = `${imgRect.top}px`;
        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.margin = '0';
        clone.className = '';
        document.body.appendChild(clone);

        const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
        const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

        gsap.to(clone, {
          x: deltaX,
          y: deltaY,
          scale: 0.2,
          rotation: 15,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            clone.remove();

            // Step 4: Cart bounce feedback
            if (cartIcon) {
              gsap.fromTo(
                cartIcon,
                { scale: 1 },
                {
                  scale: 1.3,
                  duration: 0.2,
                  ease: 'power2.out',
                  onComplete: () => {
                    gsap.to(cartIcon, {
                      scale: 1,
                      duration: 0.4,
                      ease: 'elastic.out(1, 0.3)',
                    });
                    if (onAddToCart) onAddToCart(product);
                  },
                }
              );
            }
          },
        });
      });
    }

    // Wait for fly animation to finish
    tl.to({}, { duration: 0.9 });

    // Step 5: Button success state
    tl.add(() => {
      if (spinner) {
        gsap.to(spinner, {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          onComplete: () => {
            spinner.style.display = 'none';
          },
        });
      }
    });

    tl.to(btn, {
      background: product.accent,
      borderColor: product.accent,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.1');

    tl.add(() => {
      btnText.textContent = 'ADDED ✓';
      gsap.fromTo(btnText, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }, '-=0.15');
  }, [isAddingToCart, product, cartIconRef, heroImageRef, onAddToCart]);

  return (
    <div className="relative flex flex-col justify-center items-center md:items-start z-10">
      {/* Section 5: Panel depth — radial glow behind CTA/swatches */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '260px',
          height: '260px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Section 1: Product Price */}
      <p
        className="relative text-white"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '44px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          textShadow: '0 0 25px rgba(255,255,255,0.15)',
          marginBottom: '32px',
          zIndex: 1,
        }}
      >
        {product.price}
      </p>

      {/* Section 2: Color Selector Panel */}
      <div
        className="relative flex flex-col"
        style={{ marginBottom: '32px', zIndex: 1 }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '12px',
          }}
        >
          Color
        </span>
        <div className="flex items-center" style={{ gap: '14px' }}>
          {allSwatches.map((color, i) => {
            const isActive = color === product.accent;
            return (
              <button
                key={i}
                onClick={() => onSwatchClick(color)}
                className="rounded-full cursor-pointer"
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: color,
                  outline: isActive ? '2px solid white' : '2px solid transparent',
                  outlineOffset: '3px',
                  boxShadow: isActive ? `0 0 12px ${color}` : 'none',
                  opacity: isActive ? 1 : 0.7,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.25)';
                  e.currentTarget.style.boxShadow = `0 0 12px ${color}`;
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isActive ? `0 0 12px ${color}` : 'none';
                  e.currentTarget.style.opacity = isActive ? '1' : '0.7';
                }}
                aria-label={`Select ${products[i].theme} color`}
              />
            );
          })}
        </div>
      </div>

      {/* Section 3: Primary CTA Button */}
      <div
        ref={btnWrapRef}
        className="relative self-stretch md:self-start"
        style={{ marginBottom: '36px', zIndex: 1 }}
        onMouseMove={handleBtnMouseMove}
        onMouseEnter={handleBtnEnter}
        onMouseLeave={handleBtnLeave}
      >
        <button
          ref={btnRef}
          onClick={handleAddToCart}
          className="group relative overflow-hidden w-full md:w-auto flex items-center justify-center gap-3 cursor-pointer"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '16px 42px',
            borderRadius: '30px',
            color: 'white',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (isAddingToCart) return;
            e.currentTarget.style.borderColor = `${product.accent}88`;
            e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
          }}
          onMouseLeave={(e) => {
            if (isAddingToCart) return;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
        >
          {/* Hover glow behind button */}
          <span
            ref={btnGlowRef}
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${product.accent}33 0%, transparent 70%)`,
              opacity: 0,
              scale: 0.8,
            }}
          />

          {/* Loading spinner */}
          <span
            ref={spinnerRef}
            className="atc-spinner absolute"
            style={{
              display: 'none',
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
            }}
          />

          {/* Text */}
          <span
            ref={btnTextRef}
            className="relative z-10"
          >
            ADD TO CART
          </span>

          {/* Arrow that slides in on hover */}
          <svg
            ref={btnArrowRef}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            style={{ opacity: 0, transform: 'translateX(-8px)' }}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Section 4: Product Description */}
      <p
        className="relative text-center md:text-left"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.75)',
          maxWidth: '360px',
          marginTop: '8px',
          zIndex: 1,
        }}
      >
        {product.description}
      </p>
    </div>
  );
}
