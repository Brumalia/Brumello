import { Button } from '@/components/design/Button';
import { Card, CardHeader, CardContent } from '@/components/design/Card';
import { Badge } from '@/components/design/Badge';
import { Spinner } from '@/components/design/Spinner';

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-brand-bg text-foreground p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold mb-2 border-b-2 border-brand-green pb-4">
          MISSION CONTROL DESIGN SYSTEM
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Phosphor-green accents, sharp edges, no AI-slop. Built on Tailwind +
          DM Mono + Instrument Serif.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">BUTTONS</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Button Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Primary */}
              <div>
                <p className="text-xs text-gray-500 font-mono mb-2">
                  Primary (Green Bottom Border)
                </p>
                <Button variant="primary">+ CREATE BOARD</Button>
              </div>

              {/* Secondary */}
              <div>
                <p className="text-xs text-gray-500 font-mono mb-2">
                  Secondary (Green Border)
                </p>
                <Button variant="secondary">EDIT SETTINGS</Button>
              </div>

              {/* Ghost */}
              <div>
                <p className="text-xs text-gray-500 font-mono mb-2">
                  Ghost (Minimal)
                </p>
                <Button variant="ghost">CANCEL</Button>
              </div>

              {/* Hover states */}
              <div>
                <p className="text-xs text-gray-500 font-mono mb-2">
                  Try hovering on any button above (glow effect)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">CARDS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card elevated>
            <CardHeader>
              <h3 className="font-serif text-lg text-white">Card Title</h3>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                This is a standard card with a phosphor-green border and sharp
                edges. Hover to see the glow effect.
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Created: 2026-02-14 20:30 GMT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-serif text-lg text-white">Compact Card</h3>
            </CardHeader>
            <CardContent>
              <p>Cards work great for organizing content. No rounded corners.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">BADGES</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Badge Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">PENDING</Badge>
                <Badge variant="success">ACTIVE</Badge>
                <Badge variant="warning">REVIEW</Badge>
                <Badge variant="error">BLOCKED</Badge>
                <Badge variant="info">INFO</Badge>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-4">
                Monospaced, semantic colors. Perfect for status labels and
                timestamps.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">TYPOGRAPHY</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Font Stack</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">
                  H1: Instrument Serif (headlines)
                </p>
                <h1 className="font-serif text-2xl text-white">
                  Heading Level 1
                </h1>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">
                  H2: DM Mono (list titles)
                </p>
                <h2 className="font-mono text-lg text-brand-green">
                  HEADING LEVEL 2
                </h2>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">
                  Body: Satoshi (content)
                </p>
                <p className="font-sans text-foreground">
                  Regular body text using Satoshi sans-serif. Clear, readable,
                  and works well at small sizes.
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">
                  Code/Labels: DM Mono (timestamps, IDs)
                </p>
                <p className="font-mono text-xs text-gray-500">
                  CREATED_AT: 2026-02-14T20:30:00Z | ID: bd7a8c9e
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Color Palette */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">COLORS</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Brand Palette</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="w-full h-12 bg-brand-bg border-2 border-brand-border mb-2"></div>
                <p className="font-mono text-xs text-gray-500">
                  brand-bg
                  <br />
                  #0a0e27
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-surface border-2 border-brand-border mb-2"></div>
                <p className="font-mono text-xs text-gray-500">
                  brand-surface
                  <br />
                  #11152d
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green border-2 border-brand-green mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green
                  <br />
                  #00ff41
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green-dim border-2 border-brand-green mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green-dim
                  <br />
                  #00cc33
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-cyan border-2 border-brand-cyan mb-2"></div>
                <p className="font-mono text-xs text-brand-cyan">
                  brand-cyan
                  <br />
                  #00d4ff
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-amber border-2 border-brand-amber mb-2"></div>
                <p className="font-mono text-xs text-brand-amber">
                  brand-amber
                  <br />
                  #ffa500
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spinners & Loading States */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">LOADING STATES</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Spinner Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-4">
                  Small Spinner (Default Animation)
                </p>
                <Spinner size="sm" />
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-4">
                  Medium Spinner
                </p>
                <Spinner size="md" />
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-4">
                  Large Spinner with Pulse
                </p>
                <Spinner size="lg" pulse />
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-4">
                  Progress Bar (simulated)
                </p>
                <div className="progress-bar h-1 w-full bg-brand-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Animations & Transitions */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">ANIMATIONS</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">Interactive Effects</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-mono mb-3">
                  Hover Effects (try hovering on buttons/cards)
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="primary">Hover me (glow)</Button>
                  <Button variant="secondary">Hover me (glow)</Button>
                  <Button variant="ghost">Hover me (glow)</Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-3">
                  Card Hover (subtle glow effect)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Card elevated>
                    <CardContent>Hover for glow</CardContent>
                  </Card>
                  <Card elevated>
                    <CardContent>Smooth animation</CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-3">
                  Badge Animations
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">Hover me</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-mono mb-3">
                  All animations respect prefers-reduced-motion for accessibility
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-mono text-brand-green text-lg mb-6">FEATURES</h2>
        <Card>
          <CardHeader>
            <h3 className="font-mono text-white">What Makes This Special</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Phosphor-green accents on dark background (high contrast)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Sharp 90° edges (no rounded corners, no AI-slop)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Typography hierarchy: Serif + Mono + Sans</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Subtle scanlines effect (visual depth)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>
                  Hover states with glow effect (shows interactivity clearly)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Functional, not decorative (Mission Control vibes)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-brand-border">
        <p className="font-mono text-xs text-gray-500">
          Design System v1.0 • Feb 14, 2026 • Live Build
        </p>
      </div>
    </div>
  );
}
