import { forwardRef } from 'react';

const Navbar = forwardRef(function Navbar({ accent, onCartClick, isLoading }, cartIconRef) {
  const links = ['HOME', 'CATEGORIES', 'BEST SELLERS', 'GIFT GUIDE', 'CONTACT & HELP'];

  return (
    <nav className="flex items-center justify-between h-16 w-full mb-6">
      {/* Logo */}
      <div className="navbar-logo flex items-center gap-2 shrink-0" style={{ opacity: isLoading ? 0 : 1 }}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        <span className="text-white font-semibold text-lg tracking-wider">SYNTH AUDIO</span>
      </div>

      {/* Nav Links */}
      <ul className="hidden lg:flex items-center gap-6">
        {links.map((link) => (
          <li key={link} className="navbar-stagger-item" style={{ opacity: isLoading ? 0 : 1 }}>
            <a
              href="#"
              className="nav-link relative text-white/80 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 hover:text-white"
              style={{ '--accent': accent }}
            >
              {link}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 transition-all duration-300"
                style={{ background: accent }}
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-5 shrink-0">
        <button className="navbar-stagger-item text-white/80 hover:text-white transition-colors" style={{ opacity: isLoading ? 0 : 1 }} aria-label="Search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <button className="navbar-stagger-item text-white/80 hover:text-white transition-colors" style={{ opacity: isLoading ? 0 : 1 }} aria-label="Account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <button ref={cartIconRef} onClick={onCartClick} className="navbar-stagger-item text-white/80 hover:text-white transition-colors cursor-pointer" style={{ opacity: isLoading ? 0 : 1 }} aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        </button>
      </div>
    </nav>
  );
});

export default Navbar;
