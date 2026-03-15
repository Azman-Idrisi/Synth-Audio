# Headphones — Premium Product Landing Page

A cinematic, Awwwards-style landing page for a headphone product line. Built with React, GSAP, and Tailwind CSS.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS 4**
- **GSAP** (GreenSock Animation Platform)

## Features

- **Fullscreen loader** — Black loader with percentage counter (0–100%), vertical orange progress line, and centered “SYNTH AUDIO” brand text. Loader slides up to reveal the hero.
- **Hero section** — Three-column layout: product info (price, color swatches, add-to-cart), center product image with parallax, right-side typography and navigation arrows.
- **Product switcher** — Seven color variants; switching updates gradient background, product image, and copy. Smooth GSAP transitions between products.
- **Add to Cart animation** — Press feedback, loading spinner, product image flying to the navbar cart icon, cart bounce, then “Added ✓” state. All sequenced with a GSAP timeline.
- **Cart panel** — Sliding panel from the right (glass style) with cart items, quantity controls, remove, subtotal, and “Proceed to Checkout.” Empty state when no items.
- **Responsive layout** — Adapts for mobile and tablet; left column spacing and button behavior tuned for small screens.

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app with Vite. Open the URL shown in the terminal (e.g. `http://localhost:5173`).

### Build

```bash
npm run build
```

Output is in `dist/`.

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── App.jsx              # Root: Loader + HeroSection
├── main.jsx
├── index.css             # Tailwind + global styles
├── components/
│   ├── Loader.jsx        # Fullscreen loader (counter, progress line, brand)
│   ├── HeroSection.jsx   # Hero layout, cart state, product switch logic
│   ├── Navbar.jsx        # Logo, nav links, search / account / cart
│   ├── LeftColumn.jsx    # Price, color swatches, Add to Cart, description
│   ├── CenterColumn.jsx  # Product image + pedestal
│   ├── RightColumn.jsx   # Product name, number, prev/next arrows
│   └── CartPanel.jsx     # Sliding cart drawer (items, quantity, checkout)
├── data/
│   └── products.js       # Product list (name, price, image, colors, etc.)
└── assets/               # Product images
```

## License

Private — no license specified.
