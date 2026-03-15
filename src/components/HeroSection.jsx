import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import products from '../data/products';
import Navbar from './Navbar';
import LeftColumn from './LeftColumn';
import CenterColumn from './CenterColumn';
import RightColumn from './RightColumn';
import CartPanel from './CartPanel';

export default function HeroSection({ isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const heroRef = useRef(null);
  const centerRef = useRef(null);
  const bgCurrentRef = useRef(null);
  const bloomRef = useRef(null);
  const prevIndexRef = useRef(0);
  const cartIconRef = useRef(null);
  const heroImageRef = useRef(null);

  const product = products[currentIndex];

  // ─── Page Load Animations (deferred until loader finishes) ───
  const hasPlayedIntro = useRef(false);
  useEffect(() => {
    if (isLoading || hasPlayedIntro.current) return;
    hasPlayedIntro.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-heading',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.hero-image',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2 }
      );

      gsap.to('.hero-pedestal', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      if (bloomRef.current) {
        gsap.to(bloomRef.current, {
          scale: 1.08,
          duration: 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isLoading]);

  // ─── Product Switch Animation (#7) ───
  useEffect(() => {
    if (prevIndexRef.current === currentIndex) return;

    setIsAnimating(true);
    const ctx = gsap.context(() => {
      const direction = currentIndex > prevIndexRef.current ? 1 : -1;
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          prevIndexRef.current = currentIndex;
        },
      });

      // Smooth gradient color morph
      if (bgCurrentRef.current) {
        const prevProduct = products[prevIndexRef.current];
        const proxy = {
          start: prevProduct.gradientStart,
          end: prevProduct.gradientEnd,
        };

        tl.to(
          proxy,
          {
            start: product.gradientStart,
            end: product.gradientEnd,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              bgCurrentRef.current.style.background =
                `radial-gradient(circle, ${proxy.start} 0%, ${proxy.end} 100%)`;
            },
          },
          0
        );
      }

      // Current headphone exits: scale down, fade, slide
      tl.to(
        '.hero-image',
        {
          x: -40 * direction,
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in',
        },
        0
      );

      // New headphone enters: scale up from 1.1, slide in
      tl.fromTo(
        '.hero-image',
        { x: 40 * direction, scale: 1.1, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' },
        0.3
      );
    }, heroRef);

    return () => ctx.revert();
  }, [currentIndex, product.gradientStart, product.gradientEnd]);

  // ─── Mouse Parallax (#6) ───
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to('.hero-image', {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to('.hero-image', {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  // ─── Navigation ───
  const goNext = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleSwatchClick = (color) => {
    if (isAnimating) return;
    const idx = products.findIndex((p) => p.accent === color);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  };

  const addToCart = useCallback((prod) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        accent: prod.accent,
        theme: prod.theme,
        quantity: 1,
      }];
    });
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative h-screen w-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient Background - Current */}
      <div
        ref={bgCurrentRef}
        className="absolute inset-0"
        style={{ background: product.gradient, zIndex: 0 }}
      />

      {/* Background Light Bloom (#8) */}
      <div
        ref={bloomRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${product.accent}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navbar with consistent horizontal padding */}
        <div
          className="navbar-wrapper"
          style={{
            paddingLeft: 'clamp(16px, 6vw, 120px)',
            paddingRight: 'clamp(16px, 6vw, 120px)',
          }}
        >
          <Navbar ref={cartIconRef} accent={product.accent} onCartClick={() => setIsCartOpen(true)} isLoading={isLoading} />
        </div>

        {/* 3-Column Layout with safe margins (#1) */}
        <div
          className="hero-content flex-1 grid grid-cols-1 gap-0 md:grid-cols-[1fr_1.4fr_1fr] md:gap-12 items-center overflow-hidden"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          <div className="order-1 md:order-2">
            <CenterColumn ref={centerRef} product={product} heroImageRef={heroImageRef} />
          </div>
          <div
            className="order-2 md:order-1 text-center md:text-left"
            style={{ paddingLeft: 'clamp(20px, 6vw, 120px)', paddingRight: 'clamp(20px, 4vw, 0px)' }}
          >
            <LeftColumn
              product={product}
              currentIndex={currentIndex}
              onSwatchClick={handleSwatchClick}
              cartIconRef={cartIconRef}
              heroImageRef={heroImageRef}
              onAddToCart={addToCart}
            />
          </div>
          <div
            className="order-3 hidden md:flex justify-center md:justify-end"
            style={{ paddingRight: 'clamp(40px, 6vw, 120px)' }}
          >
            <RightColumn
              product={product}
              currentIndex={currentIndex}
              totalProducts={products.length}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>
        </div>
      </div>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        accent={product.accent}
      />
    </div>
  );
}
