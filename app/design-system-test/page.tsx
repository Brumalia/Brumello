// File: app/design-system-test/page.tsx
// DROP THIS FILE IN DIRECTLY. Do not modify. Do not "improve". Do not add generic content.

'use client';

export default function DesignSystemTest() {
  return (
    <div style={{ background: '#0b1215', minHeight: '100vh', color: '#e2e8e4' }}>
      {/* STATUS BAR */}
      <div style={{
        height: 40,
        background: '#101a1e',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 36,
      }}>
        <StatusItem color="#34d399" text="System" value="healthy" />
        <StatusItem color="#34d399" text="4 agents" value="active" />
        <StatusItem color="#fbbf24" text="6 in" value="queue" />
        <StatusItem color="#34d399" value="£0.95" text="/hr" />
        <StatusItem color="#34d399" value="99.97%" text="uptime" />
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>

        {/* TITLE */}
        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 48,
          fontWeight: 400,
          color: '#f0f5f1',
          marginBottom: 8,
        }}>
          Soft Mission Control
        </h1>
        <p style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#8a9b91',
          lineHeight: 1.6,
          maxWidth: 640,
          marginBottom: 48,
        }}>
          Monochromatic green palette, rounded cards, modern typography. Everything breathes from the same warm green source.
        </p>

        {/* METRIC CARDS */}
        <SectionLabel>Metric cards</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
          <MetricCard
            label="Active agents"
            value="12"
            unit="/ 16"
            progress={75}
            active
            details={[
              { label: 'Online', value: '10' },
              { label: 'Busy', value: '2' },
            ]}
          />
          <MetricCard label="Tasks completed" value="847">
            <MiniBarChart data={[30, 50, 65, 55, 80, 88, 95]} />
          </MetricCard>
          <MetricCard
            label="Cost today"
            value="£42.80"
            progress={42}
            details={[
              { label: 'Avg / hour', value: '£0.95' },
              { label: 'Budget left', value: '£157.20' },
            ]}
          />
          <MetricCard
            label="Eval pass rate"
            value="98.2"
            unit="%"
            progress={98}
            details={[
              { label: 'Runs today', value: '24' },
              { label: 'Failures', value: '1' },
            ]}
          />
        </div>

        {/* KANBAN BOARD */}
        <SectionLabel>Board view</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
          <KanbanColumn title="Backlog" count={8}>
            <TaskCard
              badge={{ text: 'Research', bg: 'rgba(99,102,241,0.10)', color: '#818cf8' }}
              title="Survey multi-agent coordination frameworks"
              meta="2d est"
              avatar={{ text: 'MK', type: 'human' }}
            />
            <TaskCard
              badge={{ text: 'Infra', bg: 'rgba(251,191,36,0.10)', color: '#fbbf24' }}
              title="Set up staging eval pipeline"
              meta="3d est"
              avatar={{ text: 'JL', type: 'human' }}
            />
          </KanbanColumn>

          <KanbanColumn title="In Progress" count={5}>
            <TaskCard
              badge={{ text: 'Agent', bg: 'rgba(52,211,153,0.10)', color: '#34d399' }}
              title="Implement tool-use fallback chain for CodeAgent v2"
              meta="1d left"
              avatar={{ text: '⚡', type: 'agent' }}
            />
            <TaskCard
              badge={{ text: 'Eval', bg: 'rgba(248,113,113,0.10)', color: '#f87171' }}
              title="Red-team adversarial prompt suite for RAG agent"
              meta="4h left"
              avatar={{ text: 'AR', type: 'human' }}
            />
          </KanbanColumn>

          <KanbanColumn title="In Review" count={3}>
            <TaskCard
              badge={{ text: 'Agent', bg: 'rgba(52,211,153,0.10)', color: '#34d399' }}
              title="System prompt v3.2 — awaiting eval gate"
              meta="Blocked"
              avatar={{ text: '⚡', type: 'agent' }}
            />
          </KanbanColumn>

          <KanbanColumn title="Done" count={12}>
            <TaskCard
              badge={{ text: 'Agent', bg: 'rgba(52,211,153,0.10)', color: '#34d399' }}
              title="Deploy SearchAgent v1.4 to production"
              meta="Today"
              avatar={{ text: 'JL', type: 'human' }}
            />
          </KanbanColumn>
        </div>

        {/* AGENT FLEET */}
        <SectionLabel>Agent fleet</SectionLabel>
        <div style={{
          background: '#142024',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 14,
          padding: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          maxWidth: 520,
          marginBottom: 56,
        }}>
          <AgentRow status="online" name="CodeAgent v2" task="Working: fallback chain impl" latency="1.1s" />
          <AgentRow status="online" name="SearchAgent v1.4" task="Idle — awaiting tasks" latency="0.8s" />
          <AgentRow status="busy" name="RAGAgent v3" task="Eval gate: 94.1% (target 95%)" latency="2.3s" />
          <AgentRow status="offline" name="SummaryBot v1" task="Deprecated — migration pending" latency="—" last />
        </div>

        {/* BUTTONS */}
        <SectionLabel>Buttons</SectionLabel>
        <div style={{ display: 'flex', gap: 12, marginBottom: 56 }}>
          <Button variant="primary">Create board</Button>
          <Button variant="secondary">Edit settings</Button>
          <Button variant="ghost">Cancel</Button>
        </div>

        {/* BADGES */}
        <SectionLabel>Badges</SectionLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 56 }}>
          <Badge bg="rgba(52,211,153,0.12)" color="#34d399">Active</Badge>
          <Badge bg="rgba(251,191,36,0.12)" color="#fbbf24">Pending</Badge>
          <Badge bg="rgba(96,165,250,0.12)" color="#60a5fa">In review</Badge>
          <Badge bg="rgba(248,113,113,0.12)" color="#f87171">Blocked</Badge>
          <Badge bg="rgba(255,255,255,0.05)" color="#4d5f56">Idle</Badge>
        </div>

      </div>
    </div>
  );
}


// ============================================================
// COMPONENTS — all inline, no external dependencies needed
// ============================================================

function StatusItem({ color, text, value }: { color: string; text: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4d5f56' }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%', background: color,
        boxShadow: `0 0 6px ${color}40`,
        animation: 'softPulse 3s ease-in-out infinite',
      }} />
      <span style={{ color: '#8a9b91', fontWeight: 500 }}>{value}</span>
      <span>{text}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, color: '#4d5f56',
      textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function MetricCard({
  label, value, unit, progress, active, details, children,
}: {
  label: string; value: string; unit?: string; progress?: number;
  active?: boolean;
  details?: { label: string; value: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#142024',
        border: active ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.04)',
        borderRadius: 14,
        padding: 24,
        boxShadow: active
          ? '0 1px 2px rgba(0,0,0,0.3), 0 0 20px rgba(52,211,153,0.08)'
          : '0 1px 2px rgba(0,0,0,0.3)',
        transition: 'all 250ms ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = '#182a2e';
        el.style.borderColor = active ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = '#142024';
        el.style.borderColor = active ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.04)';
        el.style.boxShadow = active
          ? '0 1px 2px rgba(0,0,0,0.3), 0 0 20px rgba(52,211,153,0.08)'
          : '0 1px 2px rgba(0,0,0,0.3)';
        el.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 400, color: '#4d5f56', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: '#f0f5f1', lineHeight: 1.1, marginBottom: 16 }}>
        {value}
        {unit && <span style={{ fontFamily: 'inherit', fontSize: 14, color: '#8a9b91', marginLeft: 4, fontWeight: 400 }}>{unit}</span>}
      </div>
      {progress !== undefined && (
        <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginBottom: details ? 12 : 0, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#34d399', borderRadius: 2, transition: 'width 1s ease' }} />
        </div>
      )}
      {children}
      {details?.map((d, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', padding: '6px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontSize: 12, color: '#4d5f56' }}>{d.label}</span>
          <span style={{ fontFamily: "'Geist Mono', Consolas, monospace", fontSize: 12, color: '#8a9b91' }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBarChart({ data }: { data: number[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48, marginTop: 16 }}>
      {data.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            background: i === data.length - 1 ? '#34d399' : 'rgba(52,211,153,0.12)',
            borderRadius: '3px 3px 0 0',
            minHeight: 4,
            transition: 'background 300ms',
            cursor: 'default',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#34d399'; }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = i === data.length - 1 ? '#34d399' : 'rgba(52,211,153,0.12)';
          }}
        />
      ))}
    </div>
  );
}

function KanbanColumn({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#4d5f56', letterSpacing: '0.03em' }}>{title}</span>
        <span style={{
          fontFamily: "'Geist Mono', Consolas, monospace", fontSize: 11, color: '#4d5f56',
          background: '#142024', padding: '2px 8px', borderRadius: 6,
        }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function TaskCard({
  badge, title, meta, avatar,
}: {
  badge: { text: string; bg: string; color: string };
  title: string;
  meta: string;
  avatar: { text: string; type: 'human' | 'agent' };
}) {
  return (
    <div
      style={{
        background: '#142024',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        transition: 'all 250ms ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = '#182a2e';
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = '#142024';
        el.style.borderColor = 'rgba(255,255,255,0.04)';
        el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)';
        el.style.transform = 'translateY(0)';
      }}
    >
      <span style={{
        display: 'inline-block', fontSize: 11, fontWeight: 500,
        padding: '3px 8px', borderRadius: 6,
        background: badge.bg, color: badge.color, marginBottom: 10,
      }}>{badge.text}</span>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8e4', lineHeight: 1.5, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#4d5f56' }}>
        <span>{meta}</span>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600,
          background: avatar.type === 'agent' ? 'rgba(52,211,153,0.10)' : '#101a1e',
          border: avatar.type === 'agent' ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.07)',
          color: avatar.type === 'agent' ? '#34d399' : '#8a9b91',
        }}>{avatar.text}</div>
      </div>
    </div>
  );
}

function AgentRow({
  status, name, task, latency, last,
}: {
  status: 'online' | 'busy' | 'offline'; name: string; task: string; latency: string; last?: boolean;
}) {
  const colors = {
    online: { bg: '#34d399', shadow: 'rgba(52,211,153,0.4)' },
    busy: { bg: '#fbbf24', shadow: 'rgba(251,191,36,0.4)' },
    offline: { bg: '#4d5f56', shadow: 'none' },
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: colors[status].bg,
        boxShadow: status !== 'offline' ? `0 0 8px ${colors[status].shadow}` : 'none',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8e4', marginBottom: 3 }}>{name}</div>
        <div style={{ fontFamily: "'Geist Mono', Consolas, monospace", fontSize: 11, color: '#4d5f56' }}>{task}</div>
      </div>
      <div style={{ fontFamily: "'Geist Mono', Consolas, monospace", fontSize: 12, color: '#8a9b91' }}>{latency}</div>
    </div>
  );
}

function Button({ variant, children }: { variant: 'primary' | 'secondary' | 'ghost'; children: React.ReactNode }) {
  const styles = {
    primary: {
      background: '#34d399', color: '#0b1215', border: 'none',
      hoverBg: '#10b981', hoverShadow: '0 0 20px rgba(52,211,153,0.15)',
    },
    secondary: {
      background: '#142024', color: '#8a9b91', border: '1px solid rgba(255,255,255,0.07)',
      hoverBg: '#182a2e', hoverShadow: 'none',
    },
    ghost: {
      background: 'transparent', color: '#4d5f56', border: 'none',
      hoverBg: 'rgba(52,211,153,0.06)', hoverShadow: 'none',
    },
  };
  const s = styles[variant];
  return (
    <button
      style={{
        fontFamily: 'inherit', fontSize: 13, fontWeight: variant === 'primary' ? 600 : 500,
        padding: '10px 20px', borderRadius: 10,
        background: s.background, color: s.color, border: s.border,
        cursor: 'pointer', transition: 'all 200ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = s.hoverBg;
        if (s.hoverShadow !== 'none') el.style.boxShadow = s.hoverShadow;
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = s.background;
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}

function Badge({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 6,
      background: bg, color: color, lineHeight: 1,
    }}>
      {children}
    </span>
  );
}
