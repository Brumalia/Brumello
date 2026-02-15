import { Button } from '@/components/design/Button';
import { Card, CardHeader, CardContent, CardLabel, CardValue, CardDetail, MetricCard } from '@/components/design/Card';
import { Badge } from '@/components/design/Badge';
import { Spinner } from '@/components/design/Spinner';

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-bg-base text-foreground p-8 pt-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="font-serif text-5xl font-normal mb-4 text-text-heading">
          Soft Mission Control
        </h1>
        <p className="text-text-secondary font-sans text-base">
          Premium monochromatic green aesthetic. Emerald palette with generous spacing and refined typography.
        </p>
      </div>

      {/* Metric Cards Section (NEW!) */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Premium Metric Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Sales" value="$64,186" elevated>
            <CardDetail label="Last Year" value="$89,520" />
            <CardDetail label="Units Sold" value="4,147" />
            <CardDetail label="Customers" value="20" />
          </MetricCard>

          <MetricCard label="Active Agents" value="12 / 16">
            <CardDetail label="Processing" value="8" />
            <CardDetail label="Idle" value="4" />
            <CardDetail label="Avg Response" value="340ms" />
          </MetricCard>

          <MetricCard label="Cost Today" value="£42.80">
            <CardDetail label="Per Hour Avg" value="£1.78" />
            <CardDetail label="vs Yesterday" value="+12%" />
            <CardDetail label="Budget Left" value="£157.20" />
          </MetricCard>
        </div>
        <p className="text-xs text-text-muted font-sans mt-4">
          Big numbers in Instrument Serif 36px, detail rows in Geist Sans/Mono 12px. Hover for lift + glow.
        </p>
      </section>

      {/* Buttons Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Buttons</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Button Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Primary */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Primary (Emerald bg-emerald-400, hover: bg-emerald-500 + lift + glow)
                </p>
                <Button variant="primary">Create Board</Button>
              </div>

              {/* Secondary */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Secondary (bg-card + border, hover: bg-card-hover + border-bright)
                </p>
                <Button variant="secondary">Edit Settings</Button>
              </div>

              {/* Ghost */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Ghost (transparent, hover: bg-green-50 + text-secondary)
                </p>
                <Button variant="ghost">Cancel</Button>
              </div>

              {/* Hover states */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  10px border-radius (rounded-md), smooth 200ms transitions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card elevated>
            <CardHeader>
              <h3 className="font-sans text-lg text-text-primary font-medium">Premium Card</h3>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                14px border-radius (rounded-lg), 24px padding, subtle shadow-sm on rest, shadow-glow on hover.
                250ms transition for smooth lift effect.
              </p>
              <p className="text-xs text-text-muted font-mono">
                Created: 2026-02-15 15:20 GMT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-sans text-lg text-text-primary font-medium">Monochromatic Green</h3>
            </CardHeader>
            <CardContent>
              <p>Everything has green undertones — bg-base, bg-surface, bg-card all green-tinted.
                Borders use opacity (rgba) for subtle layering.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Badges</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Badge Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">default</Badge>
                <Badge variant="active">active</Badge>
                <Badge variant="done">done</Badge>
                <Badge variant="warning">warning</Badge>
                <Badge variant="error">error</Badge>
                <Badge variant="info">info</Badge>
                <Badge variant="idle">idle</Badge>
              </div>
              <p className="text-xs text-text-muted font-sans mt-4">
                Emerald palette (#34d399 for active/done), 6px border-radius (rounded-sm), 
                Geist Sans (not mono), rgba backgrounds with bright text.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Typography</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Font Stack</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Display: Instrument Serif 400 (headlines, big metric values)
                </p>
                <h1 className="font-serif text-4xl text-text-heading">
                  Premium Mission Control
                </h1>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Heading: Geist Sans 600 20-28px (section headings)
                </p>
                <h2 className="font-sans text-xl text-text-heading font-semibold">
                  Clean, Modern Interface Text
                </h2>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Body: Geist Sans 400 14px (readable content)
                </p>
                <p className="font-sans text-text-secondary">
                  Regular body text using Geist Sans. Modern, clean, and signals premium dev tool quality.
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Data: Geist Mono 400 13px (timestamps, IDs, costs)
                </p>
                <p className="font-mono text-xs text-text-muted">
                  created_at: 2026-02-15T15:20:00Z | id: bd7a8c9e | cost: £1.95/hr
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Labels: Geist Sans 500 11px text-muted (uppercase sparingly)
                </p>
                <p className="font-sans text-xs text-text-muted font-medium uppercase tracking-wider">
                  System Status
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Color Palette */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Colors</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Monochromatic Green Palette</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="w-full h-12 bg-bg-base border border-border-bright rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-base
                  <br />
                  #0b1215
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-bg-surface border border-border-bright rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-surface
                  <br />
                  #101a1e
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-bg-card border border-border-bright rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-card
                  <br />
                  #142024
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-bg-card-hover border border-border-bright rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-card-hover
                  <br />
                  #182a2e
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green border border-brand-green rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green
                  <br />
                  #34d399
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green-dim border border-brand-green-dim rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green-dim
                  <br />
                  #10b981
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-status-warning border border-status-warning rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-status-warning">
                  status-warning
                  <br />
                  #fbbf24
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-status-error border border-status-error rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-status-error">
                  status-error
                  <br />
                  #f87171
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-status-info border border-status-info rounded-lg mb-2"></div>
                <p className="font-mono text-xs text-status-info">
                  status-info
                  <br />
                  #60a5fa
                </p>
              </div>
            </div>
            <p className="text-xs text-text-muted font-sans mt-4">
              All backgrounds have green undertones. Borders use rgba(255,255,255,0.04/0.07/0.12) for subtle layering.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Spacing & Shadows */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Spacing & Shadows</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Refined Spacing System</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Card padding: 24px (was 16px) — generous, breathable
                </p>
                <div className="bg-bg-surface p-6 rounded-lg border border-border-subtle">
                  <p className="text-text-secondary text-sm">This card has 24px (p-6) padding</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Card gaps: 16px (gap-4) — comfortable visual rhythm
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-bg-surface p-3 rounded-lg border border-border-subtle text-xs text-text-secondary">Gap 4</div>
                  <div className="bg-bg-surface p-3 rounded-lg border border-border-subtle text-xs text-text-secondary">Gap 4</div>
                  <div className="bg-bg-surface p-3 rounded-lg border border-border-subtle text-xs text-text-secondary">Gap 4</div>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Shadows: shadow-sm (rest), shadow-glow (hover), shadow-md/lg (elevated)
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-bg-card p-4 rounded-lg shadow-sm border border-border-subtle">
                    <p className="text-xs text-text-secondary">shadow-sm</p>
                  </div>
                  <div className="bg-bg-card p-4 rounded-lg shadow-md border border-border-subtle">
                    <p className="text-xs text-text-secondary">shadow-md</p>
                  </div>
                  <div className="bg-bg-card p-4 rounded-lg shadow-lg border border-border-subtle">
                    <p className="text-xs text-text-secondary">shadow-lg</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Border Radius */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Border Radius</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Refined Radii</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-bg-surface p-4 rounded-sm border border-border-bright">
                <p className="text-xs text-text-muted">rounded-sm</p>
                <p className="font-mono text-xs text-text-secondary">6px</p>
              </div>
              <div className="bg-bg-surface p-4 rounded-md border border-border-bright">
                <p className="text-xs text-text-muted">rounded-md</p>
                <p className="font-mono text-xs text-text-secondary">10px</p>
              </div>
              <div className="bg-bg-surface p-4 rounded-lg border border-border-bright">
                <p className="text-xs text-text-muted">rounded-lg</p>
                <p className="font-mono text-xs text-text-secondary">14px</p>
              </div>
              <div className="bg-bg-surface p-4 rounded-xl border border-border-bright">
                <p className="text-xs text-text-muted">rounded-xl</p>
                <p className="font-mono text-xs text-text-secondary">18px</p>
              </div>
            </div>
            <p className="text-xs text-text-muted font-sans mt-4">
              Cards: 14px | Buttons: 10px | Badges: 6px | Modals: 18px
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-semibold mb-6">Design Philosophy</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-text-primary font-medium">Soft Mission Control Principles</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Monochromatic green palette — everything breathes together</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Emerald green (#34d399) throughout — premium, not neon</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Big numbers as visual heroes — Instrument Serif 36px</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Generous spacing — 24px card padding, 16px gaps</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Refined radii — 6/10/14/18px (sm/md/lg/xl)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Subtle shadows always present — depth without drama</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Smooth transitions — 250ms ease, lift + glow on hover</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="done">✓</Badge>
                <p className="text-text-secondary">Premium dev tool vibes — Linear × Vercel × Bloomberg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-border-subtle">
        <p className="font-sans text-xs text-text-muted">
          Design System v2.0 — Soft Mission Control • Feb 15, 2026 • Monochromatic Green
        </p>
      </div>
    </div>
  );
}
