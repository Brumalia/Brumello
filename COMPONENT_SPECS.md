# Component Specification Pack

**From Claude's Design Co-Pilot**
**Ready for Coding Agent - Feb 15, 2026**

---

## 11 Components Fully Specified

This pack contains complete specs for every major component needed to build out the Mission Control interface. Each includes:
- TypeScript interfaces
- ASCII wireframes
- Design token references
- Integration points
- Build priority order

---

## Build Priority Order

### Phase 1: Layout Shell (Foundation)
1. **Status Bar** — persistent top ticker
2. **App Sidebar** — collapsible workspace nav
3. **Navigation Bar** — top nav with logo

### Phase 2: Core Views (User-facing)
4. **Board View (Kanban)** — task cards, columns, drag-drop
5. **Agent Fleet Panel** — right sidebar with live status
6. **Metric Blocks** — reusable KPI cards

### Phase 3: Advanced Views (Power users)
7. **Eval Pipeline View** — stage flow visualization
8. **Cost Dashboard** — metrics + charts
9. **Prompt Version Control** — git-style diff view
10. **Research Board** — extended Kanban
11. **Conversation Trace Viewer** — debug timeline

---

## Component 1: Status Bar

**Purpose:** Persistent system ticker at top of page showing live fleet metrics

**Location:** Fixed top bar, z-index high, height 48px

**Content (Left to Right):**
```
[Logo Mark] [Workspace Name] | [Active Agents Count] [Queue Depth] [Cost/Hour] [System Status]
```

**Metrics Display:**
- Active Agents: count + pulsing green dot if all healthy
- Queue Depth: number of tasks pending
- Cost/hr: live spend rate with trend indicator (up/down)
- System Status: "ALL SYSTEMS GO" or alert state

**Interactions:**
- Click workspace name → dropdown to switch workspaces
- Click agent count → open Agent Fleet Panel
- Click cost → open Cost Dashboard
- All metrics update every 2-5 seconds (live)

**Design Tokens:**
```
Background: #0a0e27 (brand-bg)
Border Bottom: 1px #1a1f3a (brand-border)
Text: #ededed (foreground)
Accent: #00ff41 (brand-green)
Metrics Font: DM Mono, 12px
Status Dot: .glow-green animation
```

**Responsive:**
- Desktop: Full layout as above
- Tablet (768px): Collapse to [Logo] [Agent Count] [Cost] [Status]
- Mobile (375px): [Logo] [Status Dot] only, tap for menu

**TypeScript Interface:**
```typescript
interface StatusBar {
  workspace: {
    name: string;
    logo: React.ReactNode;
  };
  fleet: {
    activeAgents: number;
    totalAgents: number;
    healthStatus: 'all-good' | 'degraded' | 'critical';
  };
  queue: {
    pending: number;
    processing: number;
  };
  costs: {
    hourlyRate: number;
    trend: 'up' | 'down' | 'stable';
  };
  timestamp: Date;
}
```

**ASCII Wireframe:**
```
┌────────────────────────────────────────────────────────────────┐
│ ❄️ Brumalia | Agents: 5● | Queue: 12 | Cost: $0.47/hr ↑ | OK │
└────────────────────────────────────────────────────────────────┘
```

---

## Component 2: App Sidebar

**Purpose:** Collapsible left navigation for workspaces, projects, filters

**Width:** 260px (expanded), 64px (collapsed)

**Sections:**
1. **Workspace Selector** — dropdown to switch contexts
2. **Workstream Filters** — chip buttons (All, Active, Blocked, Done)
3. **Quick Links** — Boards, Dashboard, Research, Eval, Costs
4. **Agent Status Mini** — 2-line summary of active agents
5. **Settings & Help** — collapsed to icons when nav is collapsed

**Interactions:**
- Toggle collapse/expand (hamburger icon)
- Click filter chip to filter all views
- Click link to navigate
- Hover over agent status to see details
- Right-click → context menu for workspace actions

**Design Tokens:**
```
Background: #11152d (brand-surface)
Border Right: 2px #1a1f3a (brand-border)
Text: #aaa (gray-400)
Active Text: #00ff41 (brand-green)
Font: Satoshi, 14px (body), DM Mono 11px (labels)
```

**TypeScript Interface:**
```typescript
interface AppSidebar {
  workspace: Workspace;
  filters: {
    active: string;
    options: Array<{ label: string; count: number }>;
  };
  quickLinks: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
  }>;
  agentStatus: {
    active: number;
    processing: number;
    idle: number;
  };
  collapsed: boolean;
  onFilterChange: (filter: string) => void;
}
```

**ASCII Wireframe:**
```
┌──────────┐
│ Workspace│
├──────────┤
│ ⦿ All    │
│ ⦿ Active │
│ ⦿ Blocked│
├──────────┤
│ 📊 Board │
│ 📈 Dash  │
│ 🔬 Eval  │
├──────────┤
│ Agents:5 │
│ Queue:12 │
└──────────┘
```

---

## Component 3: Board View (Kanban)

**Purpose:** Task cards organized in columns (To Do, In Progress, Review, Done)

**Features:**
- Drag-and-drop cards between columns
- WIP limits per column (visual warning)
- Human/agent assignees with avatars
- Priority bar (left edge, color-coded)
- Labels and due dates visible
- Click card → open modal with full details

**Columns (Customizable):**
- To Do (cyan dot)
- In Progress (yellow dot)
- Review (orange dot)
- Done (green dot)

**Card Layout:**
```
┌─────────────────────┐
│ ▌ [Priority bar]    │
│ Task Title          │
│ 🏷️ [Label]         │
│ 👤 Assigned to      │
│ 📅 Due: Feb 20      │
│ ✅ 2/4 checklist    │
└─────────────────────┘
```

**Interactions:**
- Drag card between columns (Supabase auto-update)
- Hover → show quick actions (edit, delete, details)
- Click assignee avatar → change assignment
- Click label → filter by label
- Double-click card → open full modal

**Design Tokens:**
```
Column Header Font: Instrument Serif, 16px
Card Border: 1px #00ff41 (brand-green) on hover
Card Background: #11152d (brand-surface)
Priority Bar: 4px left edge, color per priority
Label Font: DM Mono, 10px
```

**TypeScript Interface:**
```typescript
interface Card {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: User | Agent;
  labels: Label[];
  dueDate: Date;
  checklist: { total: number; completed: number };
  description: string;
}

interface BoardView {
  columns: Array<{
    id: string;
    title: string;
    wipLimit?: number;
    cards: Card[];
  }>;
  onCardMove: (cardId: string, newColumnId: string) => void;
}
```

**ASCII Wireframe:**
```
┌─────────┬─────────┬─────────┬─────────┐
│ To Do   │ Progress│ Review  │ Done    │
│ (5)     │ (3)     │ (2)     │ (8)     │
├─────────┼─────────┼─────────┼─────────┤
│ ┌─────┐ │ ┌─────┐ │ ┌─────┐ │ ┌─────┐ │
│ │Task1│ │ │Task3│ │ │Task6│ │ │Task9│ │
│ │🔴   │ │ │🟡   │ │ │🟠   │ │ │🟢   │ │
│ └─────┘ │ └─────┘ │ └─────┘ │ └─────┘ │
│ ┌─────┐ │ ┌─────┐ │         │ ┌─────┐ │
│ │Task2│ │ │Task4│ │         │ │Task10│ │
│ │🟡   │ │ │🟢   │ │         │ │🟢   │ │
│ └─────┘ │ └─────┘ │         │ └─────┘ │
└─────────┴─────────┴─────────┴─────────┘
```

---

## Component 4: Agent Fleet Panel

**Purpose:** Right sidebar showing all agents, their status, load, cost, and recent events

**Location:** Fixed right side, collapsible, width 320px

**Sections:**
1. **Fleet Summary** — total agents, idle, processing, errors
2. **Live Agent List** — one row per agent with:
   - Agent name + icon
   - Status dot (🟢 idle, 🟡 busy, 🔴 error)
   - Current task name (truncated)
   - Mini bar chart (tasks completed last 7 days)
   - Cost this hour
3. **Event Feed** — recent agent events (started task, completed, error)
4. **Metrics** — token usage, cost/hr, avg latency

**Interactions:**
- Click agent → drill down to full agent detail view
- Hover bar chart → show tooltip (tasks per day)
- Click event → jump to that task
- Filter by status (All, Idle, Processing, Error)

**Design Tokens:**
```
Background: #0a0e27 (brand-bg)
Border Left: 2px #00ff41 (brand-green)
Agent Row: 1px #1a1f3a (brand-border)
Status Idle: #00ff41 (brand-green)
Status Busy: #ffa500 (brand-amber)
Status Error: #ff1744 (error)
Font: DM Mono 11px (stats), Satoshi 13px (names)
```

**TypeScript Interface:**
```typescript
interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'error';
  currentTask?: Task;
  tasksCompleted7d: number[];
  costThisHour: number;
  tokenUsage: { input: number; output: number };
  avgLatency: number;
}

interface AgentFleetPanel {
  agents: Agent[];
  summary: {
    total: number;
    idle: number;
    processing: number;
    errors: number;
  };
  events: Array<{
    timestamp: Date;
    agentId: string;
    event: string;
  }>;
}
```

**ASCII Wireframe:**
```
┌──────────────────────┐
│ Fleet: 5 | 2→ 3⊗    │
├──────────────────────┤
│ 🤖 Agent1       🟢   │
│   Task5         [███]│
│   Cost: $0.12/h      │
│                      │
│ 🤖 Agent2       🟡   │
│   Task8         [████]
│   Cost: $0.14/h      │
│                      │
│ 🤖 Agent3       🟢   │
│   Idle          [  ]│
│   Cost: $0.08/h      │
├──────────────────────┤
│ Events:              │
│ 14:32 A1 started T5  │
│ 14:15 A2 completed T8│
└──────────────────────┘
```

---

## Component 5: Metric Blocks

**Purpose:** Reusable KPI cards showing key numbers with trend indicators

**Variants:**
- Simple: Just number + label
- With Trend: Number + up/down indicator + % change
- With Progress: Number + progress bar to goal
- With Chart: Number + mini sparkline

**Sizes:**
- Small (1x1 grid): 160px
- Medium (2x1 grid): 320px
- Large (2x2 grid): 320px

**Design Tokens:**
```
Background: #11152d (brand-surface)
Border: 2px #00ff41 (brand-green)
Number Font: Instrument Serif, 28px, #00ff41
Label Font: DM Mono, 11px, #aaa
Trend Up: #00ff41 (green), ↑ symbol
Trend Down: #ff1744 (red), ↓ symbol
```

**TypeScript Interface:**
```typescript
interface MetricBlock {
  label: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  progress?: {
    current: number;
    goal: number;
  };
  sparkline?: number[];
  onClick?: () => void;
}
```

**ASCII Wireframe:**
```
┌──────────────────┐
│ Active Agents    │
│      5           │
│    ↑ 20%         │
└──────────────────┘

┌──────────────────┐
│ Queue Depth      │
│      12          │
│ Goal: 20 [███  ] │
└──────────────────┘
```

---

## Component 6: Eval Pipeline View

**Purpose:** Horizontal flow visualization of evaluation stages

**Stages:**
1. Dataset → 2. Run → 3. Results → 4. Gate → 5. Deploy

**Visual:**
- Boxes for each stage
- Animated connectors between stages
- Color coding: pending (gray), running (amber), passed (green), failed (red)
- Stage details on click (modal)

**Design Tokens:**
```
Pending: #666 (dark gray)
Running: #ffa500 (brand-amber) + pulsing glow
Passed: #00ff41 (brand-green)
Failed: #ff1744 (error)
Connector: 2px line with arrow
Font: DM Mono 12px for labels
```

**TypeScript Interface:**
```typescript
interface EvalStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  timestamp: Date;
  details?: Record<string, any>;
}

interface EvalPipeline {
  id: string;
  stages: EvalStage[];
  progress: number; // 0-100
}
```

**ASCII Wireframe:**
```
Dataset ──→ Run ──→ Results ──→ Gate ──→ Deploy
   ✓        ⊗         ✓        ⚠️       ◯
```

---

## Component 7: Prompt Version Control

**Purpose:** Git-style version history for prompts with side-by-side diff view

**Features:**
- Version list (left column)
- Current version view (main)
- Diff viewer (split view)
- Approval workflow
- Tags (e.g., "production", "draft", "archived")

**Design Tokens:**
```
Version List Background: #11152d (brand-surface)
Diff Added: background #00ff41 with 20% opacity
Diff Removed: background #ff1744 with 20% opacity
Version Font: DM Mono 11px
```

**TypeScript Interface:**
```typescript
interface PromptVersion {
  id: string;
  number: number;
  content: string;
  createdAt: Date;
  createdBy: User;
  tags: string[];
  approved: boolean;
}

interface PromptVersionControl {
  promptId: string;
  versions: PromptVersion[];
  currentVersion: PromptVersion;
  onDiff: (v1: string, v2: string) => void;
  onApprove: (versionId: string) => void;
}
```

---

## Component 8: Cost Dashboard

**Purpose:** Comprehensive spend tracking and breakdown by agent, model, and time

**Sections:**
1. **Summary Metrics** — total spend, avg cost/hr, projected monthly
2. **Per-Agent Bar Chart** — horizontal bars showing spend by agent
3. **Over-Time Line Chart** — daily spend trend
4. **Model Breakdown Table** — GPT-4o vs MiniMax vs others

**Design Tokens:**
```
Chart Colors: #00ff41 (primary), #00d4ff (secondary), #ffa500 (warning)
Table Font: DM Mono 11px
Metric Cards: Same as Metric Blocks
Border: 2px #00ff41 (brand-green)
```

**TypeScript Interface:**
```typescript
interface CostData {
  agent: string;
  model: string;
  spend: number;
  tokens: { input: number; output: number };
  tasksCompleted: number;
  timestamp: Date;
}

interface CostDashboard {
  totalSpend: number;
  avgHourly: number;
  projectedMonthly: number;
  costByAgent: Map<string, number>;
  costByModel: Map<string, number>;
  dailyTrend: Array<{ date: Date; spend: number }>;
}
```

---

## Component 9: Research Board

**Purpose:** Extended Kanban for research tasks with arXiv integration

**Features:**
- Standard Kanban columns (To Read, Reading, Analyzed, Implemented)
- Paper cards with title, authors, abstract snippet
- Reading status badges (unread, in progress, completed)
- Experiment linking (which task uses this research)
- Direct arXiv link + rating system

**Design Tokens:**
```
Paper Card: Same as task card but with paper icon
Abstract Font: Satoshi 12px, gray-400
Authors Font: DM Mono 10px
Rating: 5-star system with brand-green fill
```

**TypeScript Interface:**
```typescript
interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  arxivUrl: string;
  readingStatus: 'unread' | 'in-progress' | 'completed';
  rating: number;
  linkedTasks: string[];
}

interface ResearchBoard {
  papers: ResearchPaper[];
  columns: Array<{
    title: string;
    papers: ResearchPaper[];
  }>;
}
```

---

## Component 10: Conversation Trace Viewer

**Purpose:** Debug timeline for agent conversations and API calls

**Features:**
- Vertical timeline
- Expandable message blocks (user, agent, system, error)
- Color-coded by message type
- Syntax-highlighted JSON payloads
- Timestamp + latency info

**Design Tokens:**
```
User Message: Background #11152d (brand-surface), left accent #00d4ff
Agent Message: Background #11152d, left accent #00ff41
System Message: Background #11152d, left accent #ffa500
Error Message: Background #11152d, left accent #ff1744
JSON Font: DM Mono 10px, monospace
Timestamp Font: DM Mono 9px, gray
```

**TypeScript Interface:**
```typescript
interface TraceMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error';
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  latency?: number;
}

interface ConversationTrace {
  conversationId: string;
  messages: TraceMessage[];
  expanded: Set<string>;
  onToggleExpand: (messageId: string) => void;
}
```

**ASCII Wireframe:**
```
14:32:01 [User]
  "What is 2+2?"

14:32:02 [Agent] (145ms)
  {
    "response": "4",
    "confidence": 0.99
  }

14:32:03 [System]
  Task completed successfully
```

---

## Component 11: Navigation Bar

**Purpose:** Top navigation with workspace switcher, logo, and primary navigation

**Content (Left to Right):**
- **Logo Mark** (48x48px, clickable → home)
- **Workspace Name** (text or dropdown)
- **Primary Nav** (Boards, Dashboard, Research, Eval, Settings)
- **User Menu** (avatar dropdown with settings, logout)

**Design Tokens:**
```
Background: #0a0e27 (brand-bg)
Border Bottom: 2px #1a1f3a (brand-border)
Logo: ❄️ as Unicode, or custom SVG mark
Nav Font: Satoshi 14px, #ededed
Active Nav: #00ff41 (brand-green) with underline
```

**TypeScript Interface:**
```typescript
interface NavigationBar {
  workspace: Workspace;
  primaryNav: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    active: boolean;
  }>;
  user: User;
  onWorkspaceChange: (workspaceId: string) => void;
  onLogout: () => void;
}
```

**ASCII Wireframe:**
```
┌─────────────────────────────────────────────────────────┐
│ ❄️ Brumalia | Boards | Dashboard | Research | Settings │
├─────────────────────────────────────────────────────────┤
```

---

## Design Token Reference (Complete)

All components use these tokens from `tailwind.config.ts`:

```typescript
// Colors
--brand-bg: #0a0e27
--brand-surface: #11152d
--brand-border: #1a1f3a
--brand-green: #00ff41
--brand-green-dim: #00cc33
--brand-cyan: #00d4ff
--brand-amber: #ffa500
--error: #ff1744
--warning: #ffa500
--success: #00ff41
--info: #00d4ff

// Typography
--font-serif: Instrument Serif
--font-mono: DM Mono
--font-sans: Satoshi

// Sizes
--spacing-unit: 8px
--border-radius: 0px (sharp corners)
--border-width: 2px (for borders)
--border-width-thin: 1px (for dividers)

// Animations (from animations.css)
--transition-fast: 200ms ease-out
--transition-normal: 300ms ease-out
--glow-effect: 0 0 20px rgba(0, 255, 65, 0.3)
```

---

## Page Routing Structure

```
/
├── /boards              # Main board view
│   └── /boards/[id]     # Individual board
├── /dashboard           # Cost + metrics dashboard
├── /research            # Research board
├── /eval                # Eval pipeline view
├── /prompts             # Prompt version control
├── /fleet               # Agent fleet detail
├── /settings            # Settings
└── /login               # Auth (if needed)
```

---

## Build Recommendations

### Week 1 (Feb 15-22)
1. ✅ Foundation: Status Bar + Navigation Bar (complete first)
2. ✅ App Sidebar (with filter logic)
3. ✅ Board View (drag-drop works)
4. ✅ Agent Fleet Panel (live updates)
5. ✅ Metric Blocks (dashboard ready)

### Week 2 (Feb 24-28)
6. Eval Pipeline View
7. Cost Dashboard
8. Prompt Version Control
9. Research Board
10. Conversation Trace Viewer

---

## Notes for Coding Agent

- **No rounding:** All corners are 90°. Use `border-radius: 0` or Tailwind's `.border-sharp`.
- **Live updates:** Status Bar, Agent Fleet Panel, Metric Blocks should refresh every 2-5 seconds from Supabase real-time.
- **Responsive first:** All components must work at 375px (mobile).
- **Accessibility:** Keyboard nav, focus states, color contrast (WCAG AA minimum).
- **Dark mode only:** No light mode needed (always use brand-bg as background).
- **No external libraries for charts:** Use CSS animations or simple SVG for bar/line charts.
- **TypeScript everywhere:** All interfaces fully typed, no `any`.
- **Component composition:** Keep components small and composable (Button inside Card inside Dashboard, etc.).

---

## Getting Started

Feed this entire pack to your coding agent with this prompt:

> "Build the 11 components in this spec pack using React, TypeScript, and Tailwind CSS. Follow the design tokens exactly. Start with the layout shell (Status Bar, Navigation Bar, App Sidebar) first, then move to the core views (Board, Fleet Panel, Metrics). All components should integrate with the existing design system at `/components/design/`. Output components to `/components/` with demo pages at `/app/[component-name]/` where applicable. Refer to the ASCII wireframes and TypeScript interfaces for exact layout and data structures. Use the design token reference for all colors, fonts, and spacing."

---

**Ready to ship.** Feed this to your Design Agent tomorrow at 9am GMT and watch it build. 🚀

---

Commit: From Claude — `COMPONENT_SPECS.md` — Ready for agents
