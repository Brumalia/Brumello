# StatusBar Integration Plan

## Overview
This document outlines the steps to integrate the StatusBar MVP into the Brumello app shell.

---

## Deliverables

### 1. StatusBar Component (`StatusBar.tsx`)
- ✅ Fixed top bar (~48px height)
- ✅ Displays: Active agents, Queue depth, Cost/hr, Health dot
- ✅ Click opens StatusPanel
- ✅ Navy/dark background matching design system
- ✅ Phosphor-green accents

### 2. StatusPanel Component (built-in)
- ✅ Modal/drawer showing detailed stats
- ✅ Live-ish placeholders (to be wired)
- ✅ Health bar visualization
- ✅ Click backdrop or [ESC] to close

### 3. Demo Page (`StatusBarDemo.tsx`)
- ✅ Shows both controlled and integrated usage
- ✅ Simulated live updates
- ✅ Copy-paste ready for integration

---

## Integration Steps

### Step 1: Add to Layout Shell

In your app layout (e.g., `app/layout.tsx` or `components/AppShell.tsx`):

```tsx
import { StatusBar, StatusPanel } from './components/design/StatusBar';
import { useAppStore } from './store'; // your state

export default function AppShell({ children }) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  
  // Wire to your real data:
  const activeAgents = useAppStore(s => s.agents.activeCount);
  const queueDepth = useAppStore(s => s.queue.length);
  const costPerHour = useAppStore(s => s.billing.currentRate);
  const healthStatus = useAppStore(s => s.system.health);

  return (
    <div className="min-h-screen bg-brand-bg">
      <StatusBar
        onOpenDetails={() => setIsStatusOpen(true)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
      
      <StatusPanel
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
      
      {children}
    </div>
  );
}
```

### Step 2: Wire Live Data Sources

Replace simulated data with real sources:

| Data | Source | Suggested Approach |
|------|--------|-------------------|
| `activeAgents` | Agent pool | WebSocket or polling every 5s |
| `queueDepth` | Task queue | Update on queue changes |
| `costPerHour` | Billing service | Calculate from active agents |
| `healthStatus` | Health checks | WebSocket or polling every 10s |

### Step 3: Update Tailwind Config (if needed)

Ensure these colors exist in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-bg': '#0a0e27',
        'brand-surface': '#11152d',
        'brand-border': '#1a1f3a',
        'brand-green': '#00ff41',
        'brand-green-dim': '#00cc33',
        'brand-cyan': '#00d4ff',
        'brand-amber': '#ffa500',
      },
    },
  },
};
```

### Step 4: Add Fonts (if not present)

In your root layout or HTML head:

```html
<link 
  href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" 
  rel="stylesheet"
/>
```

Add to Tailwind config:

```js
theme: {
  extend: {
    fontFamily: {
      mono: ['DM Mono', 'monospace'],
      serif: ['Instrument Serif', 'serif'],
      sans: ['Satoshi', 'sans-serif'],
    },
  },
}
```

---

## Component API

### StatusBar Props

```ts
interface StatusBarProps {
  onOpenDetails?: () => void;
  activeAgents?: number;        // default: 0
  queueDepth?: number;          // default: 0
  costPerHour?: number;         // default: 0
  healthStatus?: HealthStatus; // default: 'healthy'
}
```

### StatusPanel Props

```ts
type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

interface StatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgents?: number;
  queueDepth?: number;
  costPerHour?: number;
  healthStatus?: HealthStatus;
}
```

---

## Optional Enhancements (Post-MVP)

1. **Real-time agent list** in StatusPanel
2. **Queue breakdown** (by priority, type)
3. **Cost history chart** 
4. **System alerts** banner
5. **Keyboard shortcut** (Cmd+Shift+S) to toggle panel
6. **Persistent panel position** (remember last open state)

---

## Files Modified

| File | Change |
|------|--------|
| `components/design/StatusBar.tsx` | Created/Updated |
| `components/design/index.ts` | Added exports |
| `components/design/StatusBarDemo.tsx` | Created |

---

## Review Checklist

- [ ] StatusBar displays correctly at top of screen
- [ ] All 4 signals visible (agents, queue, cost, health)
- [ ] Click opens StatusPanel
- [ ] Panel closes on backdrop click or ESC
- [ ] Design matches phosphor-green aesthetic
- [ ] Fonts loading correctly (DM Mono, Instrument Serif)
- [ ] No console errors
- [ ] Responsive (works on mobile)

---

## Questions / Follow-ups

- Should the StatusBar be visible on all routes or only mission-critical ones?
- Do you want a keyboard shortcut to toggle the panel?
- Should the panel persist open state across navigation?
- Any specific health check endpoints to wire?

---

**Created:** 2026-02-15  
**Status:** Ready for integration  
**Next:** Review in standup, wire live data
