# Cikedis — Feature Overview

Showcase site for **Cikedis**, a student snack brand.
Tagline: *snacks for better study* / **Bite Into Happiness**.

## Pages

| Route | Page | Description |
| --- | --- | --- |
| `/` | Home | Single-page showcase: hero, combo banner, menu grid, how to order, contact + footer |
| `*` | Not Found | Template 404 page |

## Sections

### 1. Header (`components/brand/SiteHeader.tsx`)
- Sticky glass header with the Cikedis logo.
- Anchor nav: The Menu, Combo Deal, How to Order, Contact.
- Always-visible call button (`tel:+601164230805`) and an "Order Now" pill.
- Collapsible hamburger menu on mobile.

### 2. Hero (`components/brand/Hero.tsx`)
- Handwritten "snacks for better study" badge.
- `H1` **Bite Into Happiness**, animated with ReactBits `SplitText` (GSAP): `rise` for "Bite Into", `pop` from center for "Happiness".
- Subheadline: *Delicious, affordable study snacks delivered directly to students.*
- Primary CTA **Order via WhatsApp / Call** → `tel:+601164230805`.
- Secondary WhatsApp CTA and "See the menu" link.
- Mascot + four floating snack packs, sparkle doodles, and a cocoa marquee strip.

### 3. Featured bundle banner (`components/brand/ComboBanner.tsx`)
- **Purchase all 4 Cikedis flavours + Potato Crisp for only RM 5!**
- Shows the RM 0.40 saving against the RM 5.40 à-la-carte total.
- CTA opens a pre-filled WhatsApp order message.

### 4. Menu & pricing grid (`components/brand/MenuGrid.tsx`)
Seven products, each with a per-item WhatsApp order button:

| Product | Price |
| --- | --- |
| Cikedis BBQ | RM 1.30 |
| Cikedis Roda | RM 1.00 |
| Cikedis Cheese | RM 1.30 |
| Cikedis Bika | RM 1.30 |
| Apollo Chocolate Layer Cake | RM 0.60 |
| Win Win Potato Crisp (Vegetable) | RM 0.50 |
| Choki-Choki Chocolate Paste | RM 0.40 / stick |

- Filter tabs: Everything / Cikedis Flavours / Study Buddies.
- Prices animate in with ReactBits `CountUp`; combo items show an "In combo" chip.
- Every card links to a ready-written WhatsApp message.

### 5. How to order (`components/brand/HowToOrder.tsx`)
Three sticker-numbered steps:
1. Browse the menu & pick your favorite snacks.
2. Click 'Order Now' to contact **Ameer** on WhatsApp / Call.
3. Confirm your order and enjoy your study snacks!

Section eyebrow animates with ReactBits `DecryptedText`.

### 6. Contact & footer (`components/brand/SiteFooter.tsx`)
- Contact person: **Ameer**.
- Phone / WhatsApp: **011-64230805**.
- Quick WhatsApp order link: `https://wa.me/601164230805`.
- Footer navigation, copyright and back-to-top.
- Fixed floating "Order now" WhatsApp button on all viewports.

## Design system

- Palette: warm brown / caramel / butter / cream, all declared as `oklch()` CSS variables in `frontend/src/index.css`.
- Fonts: Fredoka (display), Nunito (body), Caveat (handwritten accents), self-hosted variable WOFF2 in `frontend/public/fonts`.
- Motion: `MotionPrimitives` (`FadeIn`, `Stagger`, `HoverLift`) plus ReactBits `SplitText`, `CountUp`, `DecryptedText`, `ClickSpark`.
- Textures: `.paper-grain`, `.dotfield`, `.sticker` hard shadows, marquee, float/sway keyframes. `prefers-reduced-motion` is respected.
- Fully responsive; mobile-first ordering with a hamburger nav and stacked CTAs.

## Backend API

Registered under `/api/menu` (`backend/src/modules/menu.ts`):

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/menu` | `{ "category": "cikedis" \| "partner" }` (optional) | `{ success, data: { products, combo, contact } }` |
| POST | `/api/menu/combo` | – | `{ success, data: { combo, contact } }` |

The frontend renders from `frontend/src/lib/menu-data.ts` so the page is instant even before the API responds.

## SEO

- Title, meta description, Open Graph and Twitter card tags in `frontend/index.html`.
- `FoodEstablishment` JSON-LD with the full menu and prices.
- Single `H1`, semantic `header` / `main` / `section` / `footer`, alt text on all imagery, skip link, lazy-loaded below-the-fold images.

## Static build (HTML + CSS + JS, no build step)

A dependency-free version lives in `cikedis/`, deployable to any static host or opened directly:

```
cikedis/
├── index.html                 full page markup + JSON-LD
├── assets/css/styles.css      design tokens, layout, motion (vanilla CSS)
├── assets/js/main.js          ~250 lines of vanilla JS, progressive enhancement
├── assets/img/*.png           logo, mascot and 7 product cut-outs
└── assets/fonts/*.woff2       Fredoka / Nunito / Caveat variable fonts
```

Serve it with `cd cikedis && python3 -m http.server 8899`, or drag `index.html` into a browser.

| Feature | Implementation |
| --- | --- |
| Mobile nav | Hamburger button with `aria-expanded`, animated `max-height` panel, closes on link click / `Esc` |
| Sticky header | `.is-stuck` class toggled on scroll, adds border + shadow |
| Scroll reveal | `IntersectionObserver` adds `.is-in`, with a per-sibling stagger; hidden only when JS is present (`.js` gating) |
| Headline animation | JS splits "Bite Into" / "Happiness" into per-character spans with staggered `.is-in` |
| Price count-up | `data-count` + `requestAnimationFrame` easing, falls back to static text |
| Menu filter | Chips set `aria-pressed`, toggle `.is-hidden` on cards and hide empty groups |
| WhatsApp orders | `data-wa` message upgraded to `wa.me/...?text=...`; plain `wa.me` remains as the no-JS fallback |
| Active nav | `IntersectionObserver` with a centre-band `rootMargin` highlights the current section |
| Floating CTA | Appears after 420 px of scroll |
| Click spark | Star burst injected at the pointer on `pointerdown` |
| Reduced motion | `prefers-reduced-motion` disables animations and reveals all content immediately |

Verified: 13/13 reveal targets fire, filter yields 4 / 7 cards, mobile nav toggles, no horizontal overflow at 390 px, no console errors.
