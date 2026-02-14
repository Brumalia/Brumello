# Brumello Design System
## Mission Control / Command Center Aesthetic

### Core Concept
**Mission Control / Command Center**
- Dark background with phosphor-green accents
- Subtle scanlines and grid overlay
- Monospaced type + serif + sans hierarchy
- **Explicitly anti-AI-slop:** No purple gradients, no Inter, no generic card grids

---

## Typography Stack

### Primary: Monospaced
**DM Mono** (JetBrains Mono alternative)
- System labels, timestamps, code, IDs
- Data-heavy UI elements
- Board IDs, card IDs, timestamps

### Secondary: Sharp Serif
**Instrument Serif**
- Headlines (board name, list titles)
- Accent text
- Important status labels

### Tertiary: Clean Sans
**Satoshi**
- Body copy, descriptions
- UI labels and buttons
- Microcopy

---

## Color Palette

### Base
- **Background:** Near-black (`#0a0e27` or similar)
- **Surface:** Slightly lighter (`#11152d`)
- **Border:** Subtle grid lines (`#1a1f3a`)

### Accent (Phosphor Green)
- **Primary Accent:** `#00ff41` (bright phosphor green)
- **Hover/Active:** `#00cc33` (dimmer green)
- **Secondary Accent:** `#00ff41` @ 20% opacity for backgrounds
- **Scanline color:** `#00ff41` @ 5% opacity

### Semantic
- **Success:** Phosphor green
- **Warning:** Amber (`#ffa500`)
- **Error:** Red (`#ff1744`)
- **Info:** Cyan (`#00d4ff`)

---

## Visual Elements

### Scanlines
- Horizontal lines across entire UI
- Opacity: 3-5%
- Spacing: 2-3px
- Effect: Subtle, not overwhelming

### Grid Overlay
- Optional: Subtle grid in background
- Opacity: 2-3%
- Spacing: 24-32px
- Creates visual structure without clutter

### Borders & Dividers
- Phosphor green accent lines
- Mostly transparent with green glow on hover
- Monochrome except for accent color

---

## Component Examples

### Card (List/Board)
```
┌─ ▌ BOARD_NAME ─────────────────────────────┐
│                                             │
│  List 1                                     │
│  ┌──────────────┐ ┌──────────────┐         │
│  │ Card 1       │ │ Card 2       │         │
│  │ Due: 2d      │ │ Due: 5d      │         │
│  └──────────────┘ └──────────────┘         │
│                                             │
│  List 2                                     │
│  [+ Add card]                               │
│                                             │
└─────────────────────────────────────────────┘
```

### Button (Phosphor Green Accent)
```
[+ CREATE BOARD] ← Monospaced, green accent line underneath
```

### Status Indicator
```
DM Mono: "ACTIVE" or "ARCHIVED" with green/gray accent
```

---

## Interaction & Animation

### Hover States
- Scanlines brighten slightly
- Accent color glows (box-shadow with green)
- Border becomes more visible

### Transitions
- Smooth, fast (200-300ms)
- No blur effects (too "modern")
- Keeps retro feel: crisp and responsive

### Loading States
- Animated scanlines (move downward?)
- Blinking cursor in monospace UI
- Green pulse effect

---

## Avoids (Anti-Patterns)

❌ **NO:**
- Purple gradients
- Inter font
- Generic rounded cards
- Neumorphism
- Glassmorphism
- Blurred backgrounds
- Overly smooth transitions
- Lots of hover animations
- Generic card grid layouts

✅ **YES:**
- Sharp, defined edges
- High contrast
- Data-forward presentation
- Functional, not decorative
- Retro-futuristic (not retro-nostalgic)
- Clear hierarchy
- Monochrome base + green accent

---

## Implementation in Tailwind

### Colors (tailwind.config.js)
```js
colors: {
  'brand-bg': '#0a0e27',
  'brand-surface': '#11152d',
  'brand-border': '#1a1f3a',
  'brand-green': '#00ff41',
  'brand-green-dim': '#00cc33',
  'brand-cyan': '#00d4ff',
  'brand-amber': '#ffa500',
}
```

### Scanlines (Custom CSS)
```css
@layer utilities {
  .scanlines {
    background-image: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 65, 0.05) 0px,
      rgba(0, 255, 65, 0.05) 2px,
      transparent 2px,
      transparent 4px
    );
  }
}
```

### Grid Overlay (Optional)
```css
@layer utilities {
  .grid-overlay {
    background-image: 
      linear-gradient(rgba(26, 31, 58, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26, 31, 58, 0.3) 1px, transparent 1px);
    background-size: 32px 32px;
  }
}
```

---

## Font Imports

```html
<!-- DM Mono -->
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Instrument Serif -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">

<!-- Satoshi -->
<!-- From: https://github.com/Dmmmmmmm/Satoshi (free) -->
```

---

## Typography Hierarchy

### H1: Board Name
- Font: Instrument Serif Bold
- Size: 32-48px
- Color: White
- Accent: Phosphor green line underneath

### H2: List Title
- Font: DM Mono Medium
- Size: 18px
- Color: Phosphor green
- Weight: 500

### H3: Card Title
- Font: Satoshi Regular
- Size: 14px
- Color: White

### Body
- Font: Satoshi Regular
- Size: 12-14px
- Color: `#aaa` (gray)
- Line-height: 1.5

### Micro (Labels, Timestamps)
- Font: DM Mono Regular
- Size: 11px
- Color: `#666` (dark gray)
- Example: "Due: 2 days" in monospace

---

## Layout & Spacing

### Grid
- Based on 8px units
- Scanline grid: 32px
- Card padding: 16px
- List spacing: 24px

### Card Design
- No rounded corners (90° edges)
- 2px border in phosphor green
- Minimal padding inside
- Monospaced ID underneath (optional)

---

## Accessibility

- ✅ High contrast (green on near-black: 7.5:1 ratio)
- ✅ Clear hierarchy (serif > mono > sans)
- ✅ No animation-heavy interactions
- ✅ Clear focus states (green outline)
- ✅ Keyboard navigable

---

## Why This Works

1. **Anti-AI-slop:** Deliberately avoids every trend (good signal!)
2. **Functional:** Retro aesthetic serves purpose, not decoration
3. **Scalable:** Monospace makes data-heavy UIs clean
4. **Memorable:** Stands out vs every other task manager
5. **Brand:** Mission Control says "powerful, technical, in control"

---

## Phased Implementation

### Phase 1: Foundation (Week 1)
- [ ] Install fonts
- [ ] Set up Tailwind colors
- [ ] Add scanlines/grid overlays
- [ ] Update typography system

### Phase 2: Components (Week 2)
- [ ] Card redesign
- [ ] List headers
- [ ] Buttons with accent underlines
- [ ] Borders and dividers

### Phase 3: Polish (Week 3)
- [ ] Hover states (glow effect)
- [ ] Loading animations
- [ ] Modal redesign
- [ ] Empty states

### Phase 4: Refinement (Ongoing)
- [ ] Get user feedback
- [ ] Iterate on colors/spacing
- [ ] Refine animations

