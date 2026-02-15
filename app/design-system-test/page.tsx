'use client';

import React from 'react';
import { MetricCard, CardDetail, TaskCard } from '@/components/design/Card';
import { Button } from '@/components/design/Button';
import { Badge } from '@/components/design/Badge';
import { StatusBarWithPanel } from '@/components/design/StatusBar';
import { Sidebar, SidebarItem } from '@/components/design/Sidebar';

/**
 * Design System Test Page
 * 
 * Demonstrates all components from the new design system:
 * - StatusBar (fixed top)
 * - Sidebar (architectural frame)
 * - MetricCard (big numbers, Instrument Serif 36px)
 * - TaskCard (Kanban style, 16px padding)
 * - Badge (all variants, sentence case)
 * - Button (all three variants)
 * 
 * Verifies against visual reference (soft-mission-control-preview.html)
 */
export default function DesignSystemTest() {
  return (
    <div className="min-h-screen bg-base">
      {/* Status Bar - Fixed Top */}
      <StatusBarWithPanel
        activeAgents={3}
        queueDepth={12}
        costPerHour={2.47}
        healthStatus="healthy"
      />

      {/* Main Layout */}
      <div className="flex pt-10">
        {/* Sidebar Preview - Left */}
        <Sidebar className="w-64 h-screen">
          <SidebarItem label="Dashboard" icon="◆" active />
          <SidebarItem label="Tasks" icon="◇" />
          <SidebarItem label="Agents" icon="◈" />
          <SidebarItem label="Analytics" icon="◉" />
          <SidebarItem label="Settings" icon="◎" />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-display text-5xl font-normal text-text-heading mb-2">
              Design System
            </h1>
            <p className="font-sans text-base text-text-secondary">
              Soft Mission Control — Premium metric cards, smooth interactions, breathable spacing
            </p>
          </div>

          {/* Section: Metric Cards */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Metric Cards</h2>
            <div className="grid grid-cols-3 gap-6">
              <MetricCard label="Revenue" value="$64,186" elevated>
                <CardDetail label="Last Year" value="$89,520" />
                <CardDetail label="Growth" value="-28.3%" />
              </MetricCard>

              <MetricCard label="Active Users" value="2,847">
                <CardDetail label="This Month" value="2,847" />
                <CardDetail label="Last Month" value="2,103" />
              </MetricCard>

              <MetricCard label="Conversion" value="3.2%">
                <CardDetail label="Target" value="5.0%" />
                <CardDetail label="Trend" value="+0.4%" />
              </MetricCard>
            </div>
          </section>

          {/* Section: Task Cards (Kanban Style) */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Task Cards</h2>
            <div className="grid grid-cols-4 gap-4">
              <TaskCard title="Fix authentication bug">
                <Badge variant="blocked">Blocked</Badge>
                <div className="font-mono text-xs text-text-muted">TASK-142</div>
              </TaskCard>

              <TaskCard title="Design new landing page">
                <Badge variant="active">Active</Badge>
                <div className="font-mono text-xs text-text-muted">TASK-156</div>
              </TaskCard>

              <TaskCard title="Implement dark mode">
                <Badge variant="review">Review</Badge>
                <div className="font-mono text-xs text-text-muted">TASK-189</div>
              </TaskCard>

              <TaskCard title="Write API documentation">
                <Badge variant="pending">Pending</Badge>
                <div className="font-mono text-xs text-text-muted">TASK-201</div>
              </TaskCard>
            </div>
          </section>

          {/* Section: Badges */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Badges</h2>
            <div className="flex flex-wrap gap-3">
              <Badge variant="active">Active</Badge>
              <Badge variant="pending">Pending</Badge>
              <Badge variant="blocked">Blocked</Badge>
              <Badge variant="review">Review</Badge>
              <Badge variant="idle">Idle</Badge>
              <Badge variant="research">Research</Badge>
              <Badge variant="agent">Agent</Badge>
              <Badge variant="infra">Infrastructure</Badge>
              <Badge variant="eval">Evaluation</Badge>
            </div>
          </section>

          {/* Section: Buttons */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Buttons</h2>
            <div className="flex gap-4">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="ghost">Ghost Action</Button>
            </div>
          </section>

          {/* Section: Typography Hierarchy */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Typography</h2>
            <div className="space-y-4">
              <div>
                <h1 className="font-display text-4xl font-normal text-text-heading">
                  Heading 1 — Instrument Serif 48px
                </h1>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-semibold text-green-400">
                  Heading 2 — Geist Sans 24px
                </h2>
              </div>
              <div>
                <h3 className="font-sans text-lg font-medium text-text-primary">
                  Heading 3 — Geist Sans 18px
                </h3>
              </div>
              <div>
                <p className="font-sans text-base text-text-secondary">
                  Body text — Geist Sans 14px. The quick brown fox jumps over the lazy dog. 
                  This is readable, elegant body copy with proper line-height and color contrast.
                </p>
              </div>
              <div>
                <code className="font-mono text-sm text-text-muted">
                  Monospace — Geist Mono 13px • TASK-142 • £2.47
                </code>
              </div>
            </div>
          </section>

          {/* Section: Colors Reference */}
          <section>
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Color Palette</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-base border border-default rounded-md" />
                <div className="font-mono text-xs text-text-muted">base</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-surface border border-default rounded-md" />
                <div className="font-mono text-xs text-text-muted">surface</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card border border-default rounded-md" />
                <div className="font-mono text-xs text-text-muted">card</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-card-hover border border-default rounded-md" />
                <div className="font-mono text-xs text-text-muted">card-hover</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-green-400 rounded-md" />
                <div className="font-mono text-xs text-text-muted">green-400</div>
              </div>
            </div>
          </section>

          {/* Section: Interactive States */}
          <section className="pb-16">
            <h2 className="font-sans text-xl font-semibold text-green-400 mb-4">Interactive States</h2>
            <div className="space-y-4">
              <div className="font-sans text-sm text-text-secondary mb-2">
                Hover over cards and buttons to see smooth 250ms transitions with lift effect
              </div>
              <div className="grid grid-cols-2 gap-6">
                <MetricCard label="Hover Me" value="✨">
                  <CardDetail label="Lift" value="-2px" />
                  <CardDetail label="Shadow" value="md" />
                  <CardDetail label="Border" value="bright" />
                </MetricCard>
                <TaskCard title="Kanban hover test">
                  <Badge variant="active">Smooth</Badge>
                  <div className="font-mono text-xs text-text-muted">250ms ease</div>
                </TaskCard>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
