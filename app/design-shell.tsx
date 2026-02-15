import React from 'react';
import { StatusBar, StatusPanel } from '@/components/design';

export default function DesignShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  // Demo placeholders; in real app, hook up to StatusBar click
  return (
    <div>
      <StatusBar onOpenDetails={() => setOpen(true)} activeAgents={3} queueDepth={5} costPerHour={0.75} />
      <StatusPanel open={open} onClose={() => setOpen(false)} data={{ activeAgents: 3, queueDepth: 5, costs: { hourly: 0.75, totalToday: 12.34 }, lastUpdated: new Date().toISOString() }} />
      <main className="pt-12">{children}</main>
    </div>
  );
}
