---
name: Aura Commerce
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for premium retail environments where product photography is the hero. The brand personality is **composed, authoritative, and frictionless**, aiming to evoke a sense of quiet luxury and absolute reliability. 

The aesthetic follows a **refined minimalism** movement. It prioritizes extreme clarity through generous whitespace (negative space), a restricted but impactful color palette, and a sophisticated typographic scale. The interface should feel invisible, acting as a high-end gallery frame that recedes to let the products breathe. Visual noise is aggressively eliminated to reduce cognitive load during the shopping journey, ensuring the path from discovery to checkout feels inevitable and effortless.

## Colors

The palette is anchored by **Slate Midnight** (#0F172A) for primary text and brand elements, providing a deep, high-contrast foundation that feels more sophisticated than pure black. The primary action color is **Electric Cerulean** (#3B82F6), used sparingly for high-intent Call to Actions (CTAs) to ensure they are immediately discoverable against the minimalist backdrop.

Functional neutrals use a range of cool grays to define UI boundaries without creating visual clutter. The background is strictly white (#FFFFFF), with **Ghost Gray** (#F8FAFC) used for subtle section differentiation. Success, Warning, and Error states should follow standard utility conventions but with desaturated tones to remain cohesive with the professional aesthetic.

## Typography

This design system utilizes **Hanken Grotesk** for headlines to provide a sharp, contemporary edge that signals modernity. Its tight apertures and precise geometry reflect professional quality. For body copy and functional UI elements, **Inter** is used for its exceptional legibility and systematic, neutral character.

Hierarchy is established through significant size stepping and weight contrast. Display styles use negative letter-spacing to appear more cohesive at large scales. Labels use an uppercase treatment with slight tracking to differentiate "metadata" from "content." All body text is optimized for long-form readability, ensuring product descriptions are easy to digest.

## Layout & Spacing

The layout utilizes a **12-column fixed grid** for desktop (max-width 1280px) to maintain a centered, editorial feel. For mobile, the system transitions to a **4-column fluid grid**. 

The spacing rhythm is based on an **8px linear scale**, favoring larger increments (`lg` and `xl`) between major sections to enforce the minimalist aesthetic. Margins and gutters are kept generous to prevent the UI from feeling cramped. Vertical rhythm is critical; elements within a component (like a product card) use `xs` or `sm` spacing, while the distance between components uses `md` or `lg`. This "proximity grouping" ensures the user can scan the product catalog without visual exhaustion.

## Elevation & Depth

Elevation in this design system is achieved through **Tonal Layers** rather than heavy shadows. The base layer is white, and elevated elements like "Quick Add" drawers or navigation bars use a desaturated, extremely diffused shadow (`0px 10px 30px rgba(0,0,0,0.04)`) to create a subtle lift.

To maintain a flat, modern aesthetic, use **low-contrast outlines** (1px solid #E2E8F0) for structural elements like input fields and product cards. This provides clear boundaries without the weight of traditional skeuomorphism. Depth is also conveyed through "Surface-on-Surface" techniques, where a slightly darker neutral background (#F8FAFC) is used to group related content blocks, such as a "Related Products" section at the bottom of a page.

## Shapes

The shape language is **Soft (0.25rem)**, striking a balance between the precision of sharp corners and the friendliness of fully rounded ones. This subtle radius is applied to buttons, input fields, and product cards. Larger components like modal containers use `rounded-lg` (0.5rem).

Images and product photography should remain sharp or use the base `rounded-sm` (2px) to maintain a crisp, professional look. Interactive states (like hover) should not change the radius but may introduce a slight 1px border shift to indicate focus.

## Components

- **Buttons:** Primary buttons are solid Slate Midnight (#0F172A) with white text. Secondary buttons are outlined. The "Add to Cart" CTA on product pages is the only element that may use the primary accent (Electric Cerulean) to drive conversion.
- **Product Cards:** Minimalist borders with no background shadow. The focus is on the image. Typography is stacked below: Label (Category), Headline (Product Name), and Body (Price).
- **Input Fields:** 1px borders in #E2E8F0. Focus states use a 1px Slate Midnight border. Labels are always visible above the field in `label-md` style.
- **Chips/Filters:** Used for sizes, colors, and categories. They use a Ghost Gray background with no border, moving to a solid Slate Midnight background when selected.
- **Lists:** Clean, horizontal dividers (1px #F1F5F9). Used heavily in checkout and account pages.
- **Navigation:** A sticky top bar with a high-transparency blur effect (backdrop-filter: blur(8px)) to provide a hint of the content behind it while maintaining legibility.
- **Progress Indicators:** Slim, 2px lines used for the checkout funnel to indicate status without occupying significant vertical space.