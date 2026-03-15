import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export default function CartPanel({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, accent }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const itemsContainerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const prevItemCountRef = useRef(cartItems.length);

  useEffect(() => {
    if (isAnimatingRef.current) return;

    if (isOpen) {
      isAnimatingRef.current = true;
      if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto';

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    } else {
      isAnimatingRef.current = true;
      gsap.to(panelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
          isAnimatingRef.current = false;
        },
      });
    }
  }, [isOpen]);

  // Animate newly added items
  useEffect(() => {
    if (cartItems.length > prevItemCountRef.current && itemsContainerRef.current) {
      const lastCard = itemsContainerRef.current.lastElementChild;
      if (lastCard) {
        gsap.fromTo(
          lastCard,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
    prevItemCountRef.current = cartItems.length;
  }, [cartItems.length]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0"
        style={{
          zIndex: 100,
          opacity: 0,
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-screen flex flex-col"
        style={{
          zIndex: 101,
          width: '420px',
          maxWidth: '100vw',
          transform: 'translateX(100%)',
          background: 'rgba(20,20,20,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: '24px' }}
        >
          <h2
            className="text-white"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '22px',
              fontWeight: 600,
            }}
          >
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Close cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: '0 24px' }}
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Your cart is empty
              </p>
            </div>
          ) : (
            <div ref={itemsContainerRef} className="flex flex-col" style={{ gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-center gap-4"
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute cursor-pointer transition-colors duration-200"
                    style={{
                      top: '10px',
                      right: '10px',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  {/* Thumbnail */}
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      style={{ padding: '6px' }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white truncate"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '16px',
                        fontWeight: 500,
                        paddingRight: '20px',
                      }}
                    >
                      {item.name}
                    </p>

                    {/* Color indicator */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="inline-block rounded-full"
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: item.accent,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {item.theme}
                      </span>
                    </div>

                    {/* Quantity + Price row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                          style={{
                            width: '28px',
                            height: '28px',
                            background: 'rgba(255,255,255,0.06)',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          aria-label="Decrease quantity"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span
                          className="text-white text-center"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            minWidth: '20px',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                          style={{
                            width: '28px',
                            height: '28px',
                            background: 'rgba(255,255,255,0.06)',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          aria-label="Increase quantity"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <p
                        className="text-white"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '16px',
                          fontWeight: 600,
                        }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="shrink-0" style={{ padding: '24px' }}>
            {/* Subtotal */}
            <div
              className="flex items-center justify-between"
              style={{
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span
                className="text-white"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                Subtotal
              </span>
              <span
                className="text-white"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '18px',
                  fontWeight: 600,
                }}
              >
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              className="w-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 mt-5"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                height: '52px',
                borderRadius: '28px',
                background: accent,
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.25)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
