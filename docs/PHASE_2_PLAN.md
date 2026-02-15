# Phase 2: Softening the Mission Control Aesthetic

**Status**: Planning
**Timeline**: 3-4 days (Mon Feb 17 - Thu Feb 20, 2026)
**Effort**: 40-50 hours
**Lead**: Design Agent
**Reference**: docs/DESIGN_REFINEMENT_V2.md

---

## Context

Phase 1 (Completed):
- ✅ Status Bar MVP deployed
- ✅ 4 core components built (Button, Card, Badge, Spinner)
- ✅ 14+ animations shipped
- ✅ Design showcase live

**Status Bar is live and working.** Now we refine the entire aesthetic from "aggressive terminal" to "premium dev tool."

---

## High-Impact Changes (Do First)

### 1. Typography Stack (Highest Impact)
**Effort**: 4-6 hours
**Complexity**: Medium
**Why first**: Single biggest visual transformation

**Changes**:
- [ ] Add Geist Sans + Geist Mono to `tailwind.config.ts`
- [ ] Update `globals.css` to import new fonts from Google Fonts
- [ ] Update all component classes to use `font-sans` (Geist) instead of DM Mono for:
  - Nav links
  - Button labels
  - Card titles
  - Section labels
  - Form labels
- [ ] Keep DM Mono → Geist Mono for:
  - Timestamps, IDs, costs
  - Status bar items
  - Badge text
  - Code/data display
- [ ] Keep Instrument Serif for:
  - Large headlines
  - Metric values
  - Hero text
- [ ] Update `tailwind.config.ts` `fontSize` for new scale

**Files to update**:
- `tailwind.config.ts` (font config)
- `globals.css` (font imports)
- `app/globals.css` (text classes)
- All components using DM Mono for non-data text

**Verification**:
- Visit `/design-showcase` — all text should feel softer
- Check `/design-shell/statusbar` — labels now Geist Sans
- Verify all data (timestamps, IDs) still use Geist Mono

---

### 2. Color Palette Refresh (Second Highest Impact)
**Effort**: 3-4 hours
**Complexity**: Low
**Why second**: Easy to implement, major visual shift

**Changes**:
- [ ] Update `tailwind.config.ts` colors:
  ```
  bg-primary: #0c0d12 (was #0a0a0a)
  bg-surface: #13141a
  bg-card: #191a22
  bg-hover: #1e1f28
  brand-green: #00e85c (was #00ff41)
  brand-green-dim: #00c44e
  brand-cyan: #00d4ff
  brand-amber: #f5a623
  brand-red: #ef4444
  brand-blue: #6366f1
  ```
- [ ] Update border colors to use opacity:
  ```
  border-default: rgba(255, 255, 255, 0.06)
  border-bright: rgba(255, 255, 255, 0.10)
  border-focus: rgba(0, 232, 92, 0.3)
  ```
- [ ] Update text colors:
  ```
  text-primary: #e8e8e8
  text-secondary: #8a8a9a
  text-muted: #4a4a5a
  ```

**Files to update**:
- `tailwind.config.ts`
- Check all pages for color consistency

**Verification**:
- Backgrounds should feel slightly warmer (less harsh black)
- Green should feel less "neon" and more "signal"
- Opacity borders should feel softer

---

## Medium-Impact Changes (Phase 2b)

### 3. Corner Radius System
**Effort**: 6-8 hours
**Complexity**: Medium

**Changes**:
- [ ] Add radius utilities to `tailwind.config.ts`:
  ```
  radius-sm: 4px
  radius-md: 6px
  radius-lg: 8px
  radius-xl: 12px
  ```
- [ ] Update components:
  - Button: `rounded-md` (6px)
  - Card: `rounded-lg` (8px)
  - Badge: `rounded-sm` (4px)
  - Modal: `rounded-xl` (12px)
  - Inputs: `rounded-md` (6px)
  - Avatars: `rounded-md` (6px, NOT full circle)
- [ ] Keep sharp (0px):
  - Sidebar (structural)
  - Status bar (structural)
  - Top nav (structural)

**Files to update**:
- `components/design/Button.tsx`
- `components/design/Card.tsx`
- `components/design/Badge.tsx`
- Modal components
- Input components
- Avatar components

**Verification**:
- `/design-showcase` should show softened corners on all content elements
- Structural elements (sidebar) should remain sharp

---

### 4. Shadow & Depth System
**Effort**: 4-5 hours
**Complexity**: Low

**Changes**:
- [ ] Add shadow utilities to `tailwind.config.ts`:
  ```
  shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)
  shadow-elevated: 0 4px 16px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)
  shadow-glow: 0 0 20px rgba(0,232,92,0.1)
  shadow-inner-glow: inset 0 0 30px rgba(0,232,92,0.04)
  ```
- [ ] Update components:
  - Cards: `shadow-card` at rest
  - Dropdowns: `shadow-elevated`
  - Status panel: `shadow-elevated`
  - Hover states: add `shadow-glow`

**Files to update**:
- `globals.css` (shadow utility definitions)
- `components/design/*.tsx` (apply shadows)

**Verification**:
- Cards should appear to "float" slightly
- Dropdowns/panels should feel elevated
- Shadows should be subtle, not dramatic

---

## Polish Changes (Phase 2c)

### 5. Hover & Interaction States
**Effort**: 5-6 hours
**Complexity**: Medium

**Changes**:
- [ ] Add smooth transitions to all interactive elements:
  ```css
  transition: all 200ms ease;
  ```
- [ ] Card hover:
  ```css
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card), var(--shadow-glow);
    border-color: var(--border-bright);
    background: var(--bg-hover);
  }
  ```
- [ ] Button hover:
  ```css
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 24px rgba(0,232,92,0.2);
    filter: brightness(1.1);
  }
  ```
- [ ] Sidebar item hover:
  ```css
  .sidebar-item:hover {
    background: var(--brand-green-glow);
    color: var(--text-primary);
    padding-left: 22px;
  }
  ```

**Files to update**:
- `components/design/*.tsx`
- `globals.css` (shared transition rules)

**Verification**:
- Hover states should feel smooth and delicate
- Lift + glow should replace hard border changes
- No janky transitions

---

### 6. Status Bar Softening
**Effort**: 6-8 hours
**Complexity**: Medium-High

**Changes**:
- [ ] Refactor `StatusBar.tsx`:
  - Change from uppercase to sentence case
  - Merge label/value pairs into natural phrases
  - Use Geist Mono 12px instead of DM Mono 11px
  - Replace pipe dividers with generous spacing (gap: 40px)
  - Smaller dots (5px instead of 6px)
  - Add subtle bottom shadow instead of hard border
- [ ] Refactor `StatusPanel.tsx`:
  - Add margin: 8px 16px (inset from edges)
  - Add border-radius: 12px (floating card)
  - Add shadow-elevated
  - Add slideDown animation
  - Update layout to use new spacing

**Files to update**:
- `components/design/StatusBar.tsx` (major refactor)
- `components/design/StatusPanel.tsx` (major refactor)

**Verification**:
- Status bar should read as natural language: "● System healthy ● 4 agents active ● 6 in queue ● £0.95/hr"
- Panel should feel like a floating card when opened
- Animation should be smooth and delicate

---

### 7. Badge & Button Refinement
**Effort**: 3-4 hours
**Complexity**: Low-Medium

**Changes**:
- [ ] Update `Badge.tsx`:
  - Drop uppercase
  - Use semantic color fills (transparent bg + colored text)
  - Add radius: 4px
  - Status-specific badge colors
- [ ] Update `Button.tsx`:
  - Drop uppercase
  - Use Geist Sans 13px
  - Add radius: 6px
  - Smooth transitions on hover

**Files to update**:
- `components/design/Badge.tsx`
- `components/design/Button.tsx`

**Verification**:
- Badges should look like soft semantic tags, not loud labels
- Buttons should feel refined and interactive

---

## Spacing Refinement (Optional/Phase 3)
**Effort**: 4-5 hours
**Status**: Defer to Phase 3 if needed

If time: Update spacing across the app:
- Card padding: 12px → 16px
- Card gaps: 8px → 10px
- Section gaps: add 24px
- Status bar height: 36px → 40px
- Sidebar padding: adjust for new spacing

---

## Implementation Schedule

### Monday, Feb 17 (9am - 5pm GMT)
**Kickoff: Typography + Colors**
- Design Agent: Implement new font stack
- Backend Agent: Update Tailwind config with new colors
- Checkpoint: 12pm — verify fonts loading correctly
- Merge: By 1pm
- Deploy: Vercel preview by 2pm

### Tuesday, Feb 18
**Corners + Shadows**
- Design Agent: Update component border-radius
- Add shadow utilities
- Checkpoint: 12pm
- Merge + deploy by 3pm

### Wednesday, Feb 19
**Status Bar + Interactions**
- Design Agent: Refactor StatusBar & StatusPanel
- Add hover states to all components
- Checkpoint: 12pm
- Merge + deploy by 4pm

### Thursday, Feb 20
**Polish + QA**
- QA Agent: Test all pages for visual consistency
- Mobile responsiveness audit
- Final adjustments
- Production deployment: Friday morning

---

## Success Criteria

✅ **By end of Phase 2:**
- [ ] All text renders in Geist Sans (except data fields)
- [ ] New color palette applied across the app
- [ ] Corners softened (content: 4-8px, structural: 0px)
- [ ] Shadows add subtle depth without drama
- [ ] Hover states feel smooth and delicate
- [ ] Status bar reads as natural language
- [ ] Status panel feels like floating card
- [ ] Badges/buttons refined
- [ ] Zero regressions on core functionality
- [ ] Mobile responsiveness maintained
- [ ] Vercel deployment successful

---

## Rollback Plan

If something breaks:
1. Revert to `fd8a022` (Status Bar MVP — known good)
2. Cherry-pick individual component fixes
3. Deploy incrementally to catch issues early

---

## Agent Assignments

**Design Agent**:
- Lead: Typography implementation
- Refactor: Button, Badge, StatusBar, StatusPanel
- Responsible for: Visual polish, hover states, animations

**Backend Agent**:
- Tailwind config updates (fonts, colors, shadows, radius)
- Color palette consistency checks

**QA Agent**:
- Visual audit across all pages
- Mobile responsiveness testing
- Color contrast & accessibility verification
- Cross-browser testing

**Research Agent**:
- Document learnings
- Create before/after comparison screenshots
- Update design documentation

---

## Notes

- **Start with typography** — it's the most impactful change
- **Then colors** — second most impactful
- **Corners + shadows** — medium impact, quick wins
- **Status bar softening** — most complex but worth it
- **Test on `/design-showcase` first** — easiest place to verify changes

The identity **stays the same**: dark theme, green accents, monospaced data, status indicators, mission control layout.

But it now feels like it was built by a design team, not generated by a terminal emulator.

---

**Document created**: 2026-02-15 14:29 GMT
**Status**: Ready for Monday kickoff
**Questions?** Check docs/DESIGN_REFINEMENT_V2.md for detailed specs
