"use client";

import React from 'react';
import { StatusBarWithPanel } from '@/components/design/StatusBar';
import { Badge } from '@/components/design/Badge';
import { Card, CardHeader, CardContent } from '@/components/design/Card';
import { Button } from '@/components/design/Button';

export default function StatusBarPreview() {
  return (
    <div className="min-h-screen bg-bg-base text-foreground">
      {/* Status Bar with integrated panel — click to open */}
      <StatusBarWithPanel
        activeAgents={4}
        queueDepth={6}
        costPerHour={0.95}
        healthStatus="healthy"
      />

      {/* Main content — padded below fixed status bar */}
      <main className="pt-16 px-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-normal text-text-heading border-b-2 border-brand-green pb-4 mb-4">
            Mission Control
          </h1>
          <p className="font-sans text-sm text-text-secondary">
            Status Bar preview — click the bar above to open the full status panel
          </p>
        </div>

        {/* Mock Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card elevated>
            <CardHeader>
              <h2 className="font-sans text-sm font-semibold text-brand-green">Agents</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-text-heading mb-2">4</div>
              <div className="flex gap-2">
                <Badge variant="active">2 ACTIVE</Badge>
                <Badge variant="idle">2 IDLE</Badge>
              </div>
            </CardContent>
          </Card>

          <Card elevated>
            <CardHeader>
              <h2 className="font-sans text-sm font-semibold text-brand-green">Queue</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-text-heading mb-2">6</div>
              <div className="flex gap-2">
                <Badge variant="warning">3 Pending</Badge>
                <Badge variant="info">3 Processing</Badge>
              </div>
            </CardContent>
          </Card>

          <Card elevated>
            <CardHeader>
              <h2 className="font-sans text-sm font-semibold text-brand-green">Cost Today</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-brand-green mb-2">£20.50</div>
              <p className="font-mono text-xs text-text-muted">£0.95/hr avg</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-sans text-sm font-semibold text-brand-green">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="done">Done</Badge>
                <span className="text-sm text-text-secondary">Design Agent completed Status Bar MVP</span>
                <span className="font-mono text-xs text-text-muted ml-auto">09:12 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="active">Active</Badge>
                <span className="text-sm text-text-secondary">CI/CD Agent drafting GitHub Actions workflow</span>
                <span className="font-mono text-xs text-text-muted ml-auto">09:05 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="warning">Queued</Badge>
                <span className="text-sm text-text-secondary">QA Agent: mobile responsiveness audit</span>
                <span className="font-mono text-xs text-text-muted ml-auto">09:00 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="done">Done</Badge>
                <span className="text-sm text-text-secondary">Animations system shipped (14 keyframes)</span>
                <span className="font-mono text-xs text-text-muted ml-auto">Sat 22:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-sans text-sm font-semibold text-brand-green">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary">+ SPAWN AGENT</Button>
              <Button variant="secondary">VIEW FLEET</Button>
              <Button variant="ghost">COST REPORT</Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="pt-8 border-t border-border-subtle">
          <p className="font-mono text-xs text-text-muted">
            Brumello Mission Control v1.0 • Design System Preview • Feb 15, 2026
          </p>
        </div>
      </main>
    </div>
  );
}
