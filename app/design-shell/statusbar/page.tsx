"use client";

import React from 'react';
import { StatusBarWithPanel } from '@/components/design/StatusBar';
import { Badge } from '@/components/design/Badge';
import { Card, CardHeader, CardContent } from '@/components/design/Card';
import { Button } from '@/components/design/Button';

export default function StatusBarPreview() {
  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
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
          <h1 className="font-serif text-3xl text-white border-b-2 border-brand-green pb-4 mb-4">
            MISSION CONTROL
          </h1>
          <p className="font-mono text-sm text-gray-400">
            Status Bar preview — click the bar above to open the full status panel
          </p>
        </div>

        {/* Mock Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card elevated>
            <CardHeader>
              <h2 className="font-mono text-sm text-brand-green">AGENTS</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-white mb-2">4</div>
              <div className="flex gap-2">
                <Badge variant="success">2 ACTIVE</Badge>
                <Badge variant="default">2 IDLE</Badge>
              </div>
            </CardContent>
          </Card>

          <Card elevated>
            <CardHeader>
              <h2 className="font-mono text-sm text-brand-green">QUEUE</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-white mb-2">6</div>
              <div className="flex gap-2">
                <Badge variant="warning">3 PENDING</Badge>
                <Badge variant="info">3 PROCESSING</Badge>
              </div>
            </CardContent>
          </Card>

          <Card elevated>
            <CardHeader>
              <h2 className="font-mono text-sm text-brand-green">COSTS TODAY</h2>
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl text-brand-green mb-2">£20.50</div>
              <p className="font-mono text-xs text-gray-500">£0.95/hr avg</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-mono text-sm text-brand-green">RECENT ACTIVITY</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="success">DONE</Badge>
                <span className="text-sm text-gray-300">Design Agent completed Status Bar MVP</span>
                <span className="font-mono text-xs text-gray-600 ml-auto">09:12 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="info">ACTIVE</Badge>
                <span className="text-sm text-gray-300">CI/CD Agent drafting GitHub Actions workflow</span>
                <span className="font-mono text-xs text-gray-600 ml-auto">09:05 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="warning">QUEUED</Badge>
                <span className="text-sm text-gray-300">QA Agent: mobile responsiveness audit</span>
                <span className="font-mono text-xs text-gray-600 ml-auto">09:00 GMT</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">DONE</Badge>
                <span className="text-sm text-gray-300">Animations system shipped (14 keyframes)</span>
                <span className="font-mono text-xs text-gray-600 ml-auto">Sat 22:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-mono text-sm text-brand-green">QUICK ACTIONS</h2>
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
        <div className="pt-8 border-t border-brand-border">
          <p className="font-mono text-xs text-gray-600">
            Brumello Mission Control v1.0 • Design System Preview • Feb 15, 2026
          </p>
        </div>
      </main>
    </div>
  );
}
