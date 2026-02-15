# Design Refinement: Softening the Mission Control Aesthetic

> Keep the command-center identity but make it feel like something you'd **want** to live in, not something that's barking orders at you. Think less submarine war room, more premium developer tool — like Linear meets a Bloomberg terminal that went to design school.

**Status**: Pending implementation (Phase 2)
**Priority**: High (transforms overall feel)
**Estimated effort**: 3-4 days
**Reference designs**: Linear, Arc Browser, Bloomberg Terminal

---

## 1. Typography Overhaul

### New Font Stack

**Primary Font: Geist Sans** (by Vercel)
- Modern, clean, slightly humanist
- Signals "premium dev tool" (what Linear & Vercel use)
- Use for: headlines, body text, card titles, navigation
- Google Fonts: `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700`

**Mono Font: Geist Mono** (or JetBrains Mono)
- Used sparingly for system text, timestamps, IDs, code
- Google Fonts: `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500`
- Alternative: JetBrains Mono

**Display Font: Instrument Serif** (keep)
- Beautiful for large hero text and metric values
- Warmth in the system — for impact moments only

### Updated Usage Rules

| Context | Before | After |
|---------|--------|-------|
| Nav links | DM Mono 12px UPPERCASE | Geist Sans 13px, normal case, weight 500 |
| Section labels | DM Mono 9px UPPERCASE TRACKED | Geist Sans 11px, uppercase, weight 500, tracking 0.05em |
| Card titles | Satoshi 13px | Geist Sans 14px, weight 500 |
| Body text | Satoshi 14px | Geist Sans 14px, weight 400 |
| Timestamps & IDs | DM Mono 10px UPPERCASE | Geist Mono 11px, normal case |
| Badges/tags | DM Mono 9px UPPERCASE | Geist Mono 11px, normal case, weight 500 |
| Status bar items | DM Mono 11px UPPERCASE | Geist Mono 12px, normal case |
| Metric values | Instrument Serif 36px | Instrument Serif 36px (keep) |
| Page titles | Instrument Serif 48-72px | Instrument Serif 48-72px (keep) |
| Buttons | DM Mono 12px UPPERCASE | Geist Sans 13px, weight 600, normal case |

**Key principle**: Mono is now reserved for data that IS code-like (timestamps, IDs, costs, agent names). Everything navigational and descriptive moves to sans.

---

## 2. Corner Radius

Full sharp corners feel aggressive. Full rounded feels generic. Sweet spot:

```css
--radius-sm: 4px    /* badges, tags, small elements */
--radius-md: 6px    /* cards, buttons, inputs */
--radius-lg: 8px    /* panels, modals, larger containers */
--radius-xl: 12px   /* major sections, page-level containers */
```

### Where to Apply

| Element | Before | After | Rationale |
|---------|--------|-------|-----------|
| Task cards | 0px | 6px | Content element — touchable |
| Buttons | 0px | 6px | Interactive element |
| Badges/tags | 0px | 4px | Small content elements |
| Sidebar | 0px | 0px | Structural — keep flush |
| Fleet panel | 0px | 0px | Structural — keep flush |
| Metric blocks | 0px | 8px | Elevated content |
| Status bar | 0px | 0px | Structural — keep sharp |
| Avatars | 0px square | 6px | NOT circle, slightly softened square |
| Modals/overlays | 0px | 12px | Prominent content |
| Input fields | 0px | 6px | Interactive content |
| Dropdown menus | 0px | 8px | Floating content |
| Status dots | 50% | 50% | Keep circle pulse animation |

**Keep sharp (0px)**: Structural/chrome elements that go edge-to-edge (sidebar, status bar, nav). These are the "frame" — architectural.

**Soften**: Content elements that float within the frame (cards, buttons, badges). These are the "objects" — touchable.

---

## 3. Color & Background Refinement

Pure black is heavy. Shifting slightly warm/blue adds depth without losing the dark feel.

### Updated Palette

```css
/* Backgrounds — slightly warmer, with more separation between layers */
--bg-primary: #0c0d12;          /* was #0a0a0a — hint of blue-warmth */
--bg-surface: #13141a;          /* was #111111 — card/panel backgrounds */
--bg-card: #191a22;             /* was #161616 — elevated card surfaces */
--bg-hover: #1e1f28;            /* new — hover state background */

/* Borders — softer, using opacity for layering */
--border-default: rgba(255, 255, 255, 0.06);      /* was hard #1e1e1e */
--border-bright: rgba(255, 255, 255, 0.10);       /* was hard #2a2a2a */
--border-focus: rgba(0, 232, 92, 0.3);            /* green focus ring */

/* Text — unchanged, already good */
--text-primary: #e8e8e8;
--text-secondary: #8a8a9a;      /* was #6b6b6b — bumped up for readability */
--text-muted: #4a4a5a;          /* was #3a3a3a — bumped up slightly */

/* Accent — soften the green slightly */
--brand-green: #00e85c;         /* was #00ff41 — less nuclear, more minty */
--brand-green-dim: #00c44e;
--brand-green-glow: rgba(0, 232, 92, 0.08);
--brand-green-glow-strong: rgba(0, 232, 92, 0.15);

/* Other accents */
--brand-cyan: #00d4ff;
--brand-amber: #f5a623;         /* slightly warmer amber */
--brand-red: #ef4444;           /* slightly less aggressive red */
--brand-blue: #6366f1;          /* indigo instead of blue — more modern */
```

**Why the green change**: `#00ff41` is pure matrix green — very cool but visually loud. `#00e85c` is still unmistakably green and high-contrast, but it reads as "premium signal" rather than "1999 terminal".

---

## 4. Shadows & Depth

Hard borders everywhere make things feel flat and harsh. Add subtle layered shadows for depth:

```css
/* Card shadow — very subtle, creates lift */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);

/* Elevated shadow — modals, dropdowns, panels */
--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);

/* Glow — for hover states, replaces hard border change */
--shadow-glow: 0 0 20px rgba(0, 232, 92, 0.1);

/* Inner glow — for active/selected cards */
--shadow-inner-glow: inset 0 0 30px rgba(0, 232, 92, 0.04);
```

### Application

| Element | Before | After |
|---------|--------|-------|
| Task cards (resting) | border only | border + `shadow-card` |
| Task cards (hover) | border-bright | border-bright + `shadow-glow` + translateY(-2px) |
| Metric blocks | border only | border + `shadow-card` |
| Dropdowns/menus | border only | border + `shadow-elevated` |
| Active sidebar item | green-glow bg | green-glow bg + `shadow-inner-glow` |
| Status bar | hard border-bottom | subtle `shadow-elevated` underneath |

---

## 5. Spacing & Density

Current layout is tight/dense — that reads as "aggressive". Open it up slightly:

```css
/* Increase card padding */
--card-padding: 16px;           /* was 12px */

/* Increase gap between cards */
--card-gap: 10px;               /* was 8px */

/* Increase section spacing */
--section-gap: 24px;            /* between sections within a panel */

/* Status bar height */
--statusbar-height: 40px;       /* was 36px — tiny bit more room to breathe */

/* Sidebar item padding */
--sidebar-item-py: 12px;        /* was 10px */
--sidebar-item-px: 20px;        /* was 16px */
```

---

## 6. Softened Hover & Interaction States

Replace hard ON/OFF hover states with smoother transitions:

```css
/* All interactive elements */
transition: all 200ms ease;

/* Card hover — lift + subtle glow instead of hard border swap */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  border-color: var(--border-bright);
  background: var(--bg-hover);
}

/* Button hover — scale instead of just glow */
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 24px rgba(0, 232, 92, 0.2);
  filter: brightness(1.1);
}

/* Sidebar item — fade in green accent, don't snap */
.sidebar-item:hover {
  background: var(--brand-green-glow);
  color: var(--text-primary);
  padding-left: 22px;           /* subtle indent on hover */
}
```

---

## 7. Badge/Tag Refinement

Current badges are quite loud with uppercase mono. Soften them:

```css
.badge {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: none;         /* drop uppercase */
  letter-spacing: 0.02em;       /* reduce tracking */
  padding: 3px 8px;
  border-radius: 4px;
  /* Use softer, more transparent fills */
}

/* Status-specific badges */
.badge-done {
  background: rgba(0, 232, 92, 0.10);
  color: #00e85c;
}

.badge-active {
  background: rgba(99, 102, 241, 0.10);
  color: #818cf8;               /* indigo for "in progress" */
}

.badge-queued {
  background: rgba(245, 166, 35, 0.10);
  color: #f5a623;
}

.badge-blocked {
  background: rgba(239, 68, 68, 0.10);
  color: #ef4444;
}

.badge-review {
  background: rgba(0, 212, 255, 0.10);
  color: #00d4ff;
}
```

---

## 8. Button Refinement

```css
/* Primary — keep green but soften */
.btn-primary {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  text-transform: none;         /* drop uppercase */
  letter-spacing: 0.01em;
  padding: 10px 20px;
  border-radius: 6px;
  background: var(--brand-green);
  color: var(--bg-primary);
  border: none;
  transition: all 200ms ease;
}

/* Secondary — subtle border */
.btn-secondary {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  padding: 10px 20px;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-bright);
  transition: all 200ms ease;
}

/* Ghost — minimal */
.btn-ghost {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  border: none;
}
```

---

## 9. Status Bar Softening

Most "aggressive" element. Soften without losing function:

### Before (Hard)
```
[●] SYS OPERATIONAL | [●] AGENTS 12 ACTIVE | [●] QUEUE 47 TASKS
```
All caps, hard dividers, dense.

### After (Softened)
```
● System healthy ● 4 agents active ● 6 in queue ● £0.95/hr ● 99.97% uptime
```

Changes:
- Drop the hard label/value split — merge into natural phrases
- Sentence case, not uppercase
- Geist Mono 12px, normal case
- Dividers become generous spacing (gap: 40px) rather than pipe characters
- Dots keep the pulse animation but are slightly smaller (5px)
- Bar shadow: `box-shadow: 0 1px 4px rgba(0,0,0,0.3)` instead of hard border-bottom

### Expanded Panel (Floating Card)

```css
.status-panel {
  margin: 8px 16px;             /* inset from edges */
  border-radius: 12px;          /* rounded — floating card feel */
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-elevated);
  animation: slideDown 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 10. Overall Vibe Shift

| Dimension | Before | After |
|-----------|--------|-------|
| Corners | 0px everywhere | 0px structural, 4-8px content |
| Typography | All-caps mono dominant | Sans-serif dominant, mono for data only |
| Background | Pure black #0a0a0a | Dark blue-black #0c0d12 |
| Borders | Hard solid lines | Transparent/opacity-based |
| Green | Nuclear #00ff41 | Mint #00e85c |
| Shadows | None | Subtle layered depth |
| Hover states | Hard border swap | Lift + glow + smooth transition |
| Spacing | Tight/dense | Slightly more generous |
| Buttons | Uppercase mono, square | Sentence case, sans, 6px radius |
| **Overall tone** | **War room** | **Premium dev tool** |
| **Reference** | Submarine control panel | Linear × Arc Browser × Bloomberg |

---

## Implementation Priority

1. **Phase 2a (Days 1-2)**: Typography + Colors
   - Update `tailwind.config.ts` with new font stack and color palette
   - Update `globals.css` with new font imports
   - Update all component text rendering (most impactful change)

2. **Phase 2b (Day 3)**: Corners + Shadows
   - Add radius utilities to Tailwind
   - Update Button, Card, Badge, Modal components
   - Add shadow utilities

3. **Phase 2c (Days 4-5)**: Hover states + Status Bar
   - Smooth transitions across all interactive elements
   - Refactor StatusBar to use softer styling
   - Update form inputs, dropdowns

4. **Verification**: Visual audit, mobile responsiveness, accessibility

---

## Notes for Implementation

- Start with typography and corners — those alone transform the feel
- Colors are next — the softer green + bg shift
- Shadows and spacing are polish — they should be incremental refinements
- Test on the `/design-showcase` route first before rolling to main app
- Keep all structural elements (sidebar, status bar) at 0px — this maintains control/authority
- Only soften content elements — maintains the visual hierarchy

**Identity Preserved**: Dark theme, green accents, monospaced data, status indicators, mission control layout. But it now feels like it was built by a design team, not generated by a terminal emulator.

---

*Document created: 2026-02-15 14:29 GMT*
*Authored by: Matty (design vision)*
*Status: Ready for implementation*
