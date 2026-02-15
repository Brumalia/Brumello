'use client';

import React from 'react';

/**
 * Soft Mission Control - Design System Test Page
 * Built to EXACT spec from BUILD_EXACT_PAGE_SPEC.md
 * NO improvisation, NO placeholder content
 */
export default function DesignSystemTest() {
  return (
    <div className="min-h-screen bg-base">
      {/* STATUS BAR - Fixed Top */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-surface border-b border-subtle z-50">
        <div className="h-full flex items-center px-8 gap-9">
          <StatusItem color="green" label="System healthy" />
          <StatusItem color="green" label="4 agents" value="active" />
          <StatusItem color="amber" label="6 in" value="queue" />
          <StatusItem color="green" value="£0.95" label="/hr" />
          <StatusItem color="green" value="99.97%" label="uptime" />
        </div>
      </div>

      {/* MAIN CONTENT - Below status bar */}
      <div className="pt-10">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          
          {/* PAGE TITLE */}
          <div className="mb-12">
            <h1 className="font-display text-[48px] font-normal text-text-heading leading-tight mb-3">
              Soft Mission Control
            </h1>
            <p className="font-sans text-base font-normal text-text-secondary leading-[1.6] max-w-[640px]">
              Monochromatic green palette, rounded cards, modern typography. Everything breathes from the same warm green source.
            </p>
          </div>

          {/* SECTION: METRIC CARDS */}
          <section className="mb-12">
            <SectionLabel>Metric cards</SectionLabel>
            <div className="grid grid-cols-4 gap-4">
              <MetricCardActiveAgents />
              <MetricCardTasksCompleted />
              <MetricCardCostToday />
              <MetricCardEvalPassRate />
            </div>
          </section>

          {/* SECTION: BOARD VIEW */}
          <section className="mb-12">
            <SectionLabel>Board view</SectionLabel>
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="w-[260px] bg-surface rounded-2xl p-5 border border-subtle">
                <div className="mb-6">
                  <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3">
                    Workstreams
                  </div>
                  <div className="space-y-1">
                    <SidebarItem active>Agent Development</SidebarItem>
                    <SidebarItem>Research</SidebarItem>
                    <SidebarItem>Infrastructure</SidebarItem>
                    <SidebarItem>Evaluation</SidebarItem>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3">
                    Filters
                  </div>
                  <div className="space-y-1">
                    <SidebarItem>Assigned to agents</SidebarItem>
                    <SidebarItem>Blocked</SidebarItem>
                    <SidebarItem>Needs review</SidebarItem>
                  </div>
                </div>
              </div>

              {/* Kanban Grid */}
              <div className="flex-1 grid grid-cols-4 gap-4">
                {/* Column 1: Backlog */}
                <KanbanColumn title="Backlog" count={8}>
                  <TaskCard
                    badge="Research"
                    badgeColor="blue"
                    title="Survey multi-agent coordination frameworks"
                    meta="2d est"
                    avatar="MK"
                  />
                  <TaskCard
                    badge="Infra"
                    badgeColor="amber"
                    title="Set up staging eval pipeline"
                    meta="3d est"
                    avatar="JL"
                  />
                </KanbanColumn>

                {/* Column 2: In Progress */}
                <KanbanColumn title="In Progress" count={5}>
                  <TaskCard
                    badge="Agent"
                    badgeColor="green"
                    title="Implement tool-use fallback chain for CodeAgent v2"
                    meta="1d left"
                    avatarType="agent"
                  />
                  <TaskCard
                    badge="Eval"
                    badgeColor="red"
                    title="Red-team adversarial prompt suite for RAG agent"
                    meta="4h left"
                    avatar="AR"
                  />
                </KanbanColumn>

                {/* Column 3: In Review */}
                <KanbanColumn title="In Review" count={3}>
                  <TaskCard
                    badge="Agent"
                    badgeColor="green"
                    title="System prompt v3.2 — awaiting eval gate"
                    meta="Blocked"
                    avatarType="agent"
                  />
                </KanbanColumn>

                {/* Column 4: Done */}
                <KanbanColumn title="Done" count={12}>
                  <TaskCard
                    badge="Agent"
                    badgeColor="green"
                    title="Deploy SearchAgent v1.4 to production"
                    meta="Today"
                    avatar="JL"
                  />
                </KanbanColumn>
              </div>
            </div>
          </section>

          {/* SECTION: AGENT FLEET */}
          <section className="mb-12">
            <SectionLabel>Agent fleet</SectionLabel>
            <div className="max-w-[520px] bg-card border border-subtle rounded-2xl p-6 shadow-sm">
              <AgentRow
                indicator="green"
                name="CodeAgent v2"
                task="Working: fallback chain impl"
                latency="1.1s"
              />
              <AgentRow
                indicator="green"
                name="SearchAgent v1.4"
                task="Idle — awaiting tasks"
                latency="0.8s"
              />
              <AgentRow
                indicator="amber"
                name="RAGAgent v3"
                task="Eval gate: 94.1% (target 95%)"
                latency="2.3s"
              />
              <AgentRow
                indicator="grey"
                name="SummaryBot v1"
                task="Deprecated — migration pending"
                latency="—"
                last
              />
            </div>
          </section>

          {/* SECTION: BUTTONS */}
          <section className="mb-12">
            <SectionLabel>Buttons</SectionLabel>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-green-400 text-base text-[13px] font-semibold rounded-[10px] transition-all duration-250 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:-translate-y-px">
                Create board
              </button>
              <button className="px-5 py-2.5 bg-card text-text-secondary text-[13px] font-medium border border-default rounded-[10px] transition-all duration-250 hover:bg-card-hover hover:border-bright hover:text-text-primary">
                Edit settings
              </button>
              <button className="px-5 py-2.5 bg-transparent text-text-muted text-[13px] font-medium rounded-[10px] transition-all duration-250 hover:bg-green-50 hover:text-text-secondary">
                Cancel
              </button>
            </div>
          </section>

          {/* SECTION: BADGES */}
          <section className="mb-12">
            <SectionLabel>Badges</SectionLabel>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-[rgba(52,211,153,0.12)] text-green-400 text-[11px] font-medium rounded-sm">
                Active
              </span>
              <span className="px-2.5 py-1 bg-[rgba(251,191,36,0.12)] text-[#fbbf24] text-[11px] font-medium rounded-sm">
                Pending
              </span>
              <span className="px-2.5 py-1 bg-[rgba(96,165,250,0.12)] text-[#60a5fa] text-[11px] font-medium rounded-sm">
                In review
              </span>
              <span className="px-2.5 py-1 bg-[rgba(248,113,113,0.12)] text-[#f87171] text-[11px] font-medium rounded-sm">
                Blocked
              </span>
              <span className="px-2.5 py-1 bg-[rgba(255,255,255,0.05)] text-text-muted text-[11px] font-medium rounded-sm">
                Idle
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium text-text-muted uppercase tracking-[0.06em] mb-5">
      {children}
    </div>
  );
}

function StatusItem({ 
  color, 
  label, 
  value 
}: { 
  color: 'green' | 'amber'; 
  label: string; 
  value?: string;
}) {
  const dotColor = color === 'green' ? '#34d399' : '#fbbf24';
  const shadowColor = color === 'green' 
    ? 'rgba(52, 211, 153, 0.4)' 
    : 'rgba(251, 191, 36, 0.4)';

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-[5px] h-[5px] rounded-full animate-[softPulse_3s_ease-in-out_infinite]"
        style={{ 
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${shadowColor}`
        }}
      />
      <span className="text-xs font-normal text-text-muted">
        {value && <span className="font-medium text-text-secondary">{value}</span>}
        {value && ' '}
        {label}
      </span>
    </div>
  );
}

function MetricCardActiveAgents() {
  return (
    <div className="bg-card border border-[rgba(52,211,153,0.2)] rounded-[14px] p-6 shadow-sm shadow-[0_0_20px_rgba(52,211,153,0.08)] transition-all duration-250 hover:bg-card-hover hover:border-default hover:shadow-md hover:-translate-y-0.5">
      <div className="text-[13px] font-normal text-text-muted mb-2">Active agents</div>
      <div className="mb-3">
        <span className="font-display text-[36px] font-normal text-text-heading">12</span>
        <span className="font-sans text-sm text-text-secondary"> / 16</span>
      </div>
      <div className="h-[3px] bg-[rgba(255,255,255,0.04)] rounded-sm mb-3 overflow-hidden">
        <div className="h-full bg-green-400 rounded-sm" style={{ width: '75%' }} />
      </div>
      <div className="space-y-0">
        <DetailRow label="Online" value="10" />
        <DetailRow label="Busy" value="2" />
      </div>
    </div>
  );
}

function MetricCardTasksCompleted() {
  const barHeights = [30, 50, 65, 55, 80, 88, 95];
  
  return (
    <div className="bg-card border border-subtle rounded-[14px] p-6 shadow-sm transition-all duration-250 hover:bg-card-hover hover:border-default hover:shadow-md hover:-translate-y-0.5">
      <div className="text-[13px] font-normal text-text-muted mb-2">Tasks completed</div>
      <div className="mb-3">
        <span className="font-display text-[36px] font-normal text-text-heading">847</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {barHeights.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] transition-all duration-250 hover:bg-green-400"
            style={{
              height: `${height}%`,
              backgroundColor: i === barHeights.length - 1 
                ? '#34d399' 
                : 'rgba(52, 211, 153, 0.12)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MetricCardCostToday() {
  return (
    <div className="bg-card border border-subtle rounded-[14px] p-6 shadow-sm transition-all duration-250 hover:bg-card-hover hover:border-default hover:shadow-md hover:-translate-y-0.5">
      <div className="text-[13px] font-normal text-text-muted mb-2">Cost today</div>
      <div className="mb-3">
        <span className="font-display text-[36px] font-normal text-text-heading">£42.80</span>
      </div>
      <div className="h-[3px] bg-[rgba(255,255,255,0.04)] rounded-sm mb-3 overflow-hidden">
        <div className="h-full bg-green-400 rounded-sm" style={{ width: '42%' }} />
      </div>
      <div className="space-y-0">
        <DetailRow label="Avg / hour" value="£0.95" />
        <DetailRow label="Budget left" value="£157.20" />
      </div>
    </div>
  );
}

function MetricCardEvalPassRate() {
  return (
    <div className="bg-card border border-subtle rounded-[14px] p-6 shadow-sm transition-all duration-250 hover:bg-card-hover hover:border-default hover:shadow-md hover:-translate-y-0.5">
      <div className="text-[13px] font-normal text-text-muted mb-2">Eval pass rate</div>
      <div className="mb-3">
        <span className="font-display text-[36px] font-normal text-text-heading">98.2</span>
        <span className="font-sans text-sm text-text-secondary">%</span>
      </div>
      <div className="h-[3px] bg-[rgba(255,255,255,0.04)] rounded-sm mb-3 overflow-hidden">
        <div className="h-full bg-green-400 rounded-sm" style={{ width: '98%' }} />
      </div>
      <div className="space-y-0">
        <DetailRow label="Runs today" value="24" />
        <DetailRow label="Failures" value="1" />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-t border-[rgba(255,255,255,0.04)]">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="font-mono text-xs text-text-secondary">{value}</span>
    </div>
  );
}

function SidebarItem({ 
  children, 
  active 
}: { 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <div className={`
      flex items-center gap-2 py-2.5 px-2.5 rounded-r-md transition-all duration-250
      ${active 
        ? 'bg-green-100 text-green-400' 
        : 'text-text-muted hover:bg-green-50'
      }
    `}>
      <div 
        className={`w-[6px] h-[6px] rounded-full ${
          active ? 'bg-green-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-text-muted'
        }`}
      />
      <span className="text-sm font-normal">{children}</span>
    </div>
  );
}

function KanbanColumn({ 
  title, 
  count, 
  children 
}: { 
  title: string; 
  count: number; 
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-1 py-2 mb-3">
        <span className="text-xs font-medium text-text-muted tracking-[0.03em]">{title}</span>
        <span className="font-mono text-[11px] text-text-muted bg-card px-2 py-0.5 rounded-md">
          {count}
        </span>
      </div>
      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
}

function TaskCard({
  badge,
  badgeColor,
  title,
  meta,
  avatar,
  avatarType
}: {
  badge: string;
  badgeColor: 'blue' | 'amber' | 'green' | 'red';
  title: string;
  meta: string;
  avatar?: string;
  avatarType?: 'agent' | 'human';
}) {
  const badgeColors = {
    blue: { bg: 'rgba(99, 102, 241, 0.10)', text: '#818cf8' },
    amber: { bg: 'rgba(251, 191, 36, 0.10)', text: '#fbbf24' },
    green: { bg: 'rgba(52, 211, 153, 0.10)', text: '#34d399' },
    red: { bg: 'rgba(248, 113, 113, 0.10)', text: '#f87171' }
  };

  const colors = badgeColors[badgeColor];

  return (
    <div className="bg-card border border-subtle rounded-[14px] p-4 shadow-sm transition-all duration-250 hover:bg-card-hover hover:border-default hover:shadow-md hover:-translate-y-0.5">
      <div className="mb-2">
        <span 
          className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-md"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {badge}
        </span>
      </div>
      <div className="text-sm font-medium text-text-primary leading-[1.5] mb-3">
        {title}
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{meta}</span>
        {avatarType === 'agent' ? (
          <div className="w-6 h-6 rounded-md bg-green-100 border border-[rgba(52,211,153,0.2)] flex items-center justify-center text-green-400 text-xs">
            ⚡
          </div>
        ) : avatar ? (
          <div className="w-6 h-6 rounded-md bg-input border border-default flex items-center justify-center text-text-secondary text-[10px] font-semibold">
            {avatar}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AgentRow({
  indicator,
  name,
  task,
  latency,
  last
}: {
  indicator: 'green' | 'amber' | 'grey';
  name: string;
  task: string;
  latency: string;
  last?: boolean;
}) {
  const indicatorColors = {
    green: { bg: '#34d399', shadow: '0 0 8px rgba(52, 211, 153, 0.4)' },
    amber: { bg: '#fbbf24', shadow: '0 0 8px rgba(251, 191, 36, 0.4)' },
    grey: { bg: '#4d5f56', shadow: 'none' }
  };

  const colors = indicatorColors[indicator];

  return (
    <div className={`flex items-center gap-3.5 py-3.5 ${!last ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}>
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ 
          backgroundColor: colors.bg,
          boxShadow: colors.shadow
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary mb-0.5">{name}</div>
        <div className="font-mono text-[11px] text-text-muted">{task}</div>
      </div>
      <div className="font-mono text-xs text-text-secondary flex-shrink-0">
        {latency}
      </div>
    </div>
  );
}
