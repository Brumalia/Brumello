import { Button } from '@/components/design/Button';
import { Card, CardHeader, CardContent } from '@/components/design/Card';
import { Badge } from '@/components/design/Badge';
import { Spinner } from '@/components/design/Spinner';

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-bg-primary text-foreground p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold mb-2 border-b-2 border-brand-green pb-4">
          Mission Control Design System
        </h1>
        <p className="text-text-secondary font-sans text-sm">
          Softened mission control aesthetic. Premium dev tool vibes with Geist Sans + Geist Mono + Instrument Serif.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Buttons</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Button Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Primary */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Primary (Green fill, lifts on hover)
                </p>
                <Button variant="primary">Create Board</Button>
              </div>

              {/* Secondary */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Secondary (Border, subtle lift)
                </p>
                <Button variant="secondary">Edit Settings</Button>
              </div>

              {/* Ghost */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Ghost (Minimal, hover highlight)
                </p>
                <Button variant="ghost">Cancel</Button>
              </div>

              {/* Hover states */}
              <div>
                <p className="text-xs text-text-muted font-sans mb-2">
                  Try hovering on any button above (smooth lift + glow)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card elevated>
            <CardHeader>
              <h3 className="font-sans text-lg text-white font-medium">Card Title</h3>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                Softened 6px corners, layered shadows for depth. Hover to see the subtle lift and glow.
              </p>
              <p className="text-xs text-text-muted font-mono">
                Created: 2026-02-14 20:30 GMT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-sans text-lg text-white font-medium">Compact Card</h3>
            </CardHeader>
            <CardContent>
              <p>Cards use opacity-based borders and layered backgrounds for a premium feel.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Badges</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Badge Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">pending</Badge>
                <Badge variant="success">active</Badge>
                <Badge variant="warning">review</Badge>
                <Badge variant="error">blocked</Badge>
                <Badge variant="info">info</Badge>
              </div>
              <p className="text-xs text-text-muted font-sans mt-4">
                Geist Mono for data-like content, 4px corners, softened color fills with transparency.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Typography</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Font Stack</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-sans mb-1">
                  Display: Instrument Serif (headlines, large numbers)
                </p>
                <h1 className="font-serif text-2xl text-white">
                  Premium Mission Control
                </h1>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-1">
                  Primary: Geist Sans (UI, navigation, content)
                </p>
                <h2 className="font-sans text-lg text-brand-green font-medium">
                  Clean, Modern Interface Text
                </h2>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-1">
                  Body: Geist Sans (readable at all sizes)
                </p>
                <p className="font-sans text-foreground">
                  Regular body text using Geist Sans. Modern, clean, and signals premium dev tool quality.
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-1">
                  Data: Geist Mono (timestamps, IDs, costs, badges)
                </p>
                <p className="font-mono text-xs text-text-muted">
                  created_at: 2026-02-14T20:30:00Z | id: bd7a8c9e | cost: £0.95/hr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Color Palette */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Colors</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Brand Palette</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="w-full h-12 bg-bg-primary border border-border-bright rounded mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-primary
                  <br />
                  #0c0d12
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-bg-surface border border-border-bright rounded mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-surface
                  <br />
                  #13141a
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-bg-card border border-border-bright rounded mb-2"></div>
                <p className="font-mono text-xs text-text-muted">
                  bg-card
                  <br />
                  #191a22
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green border border-brand-green rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green
                  <br />
                  #00e85c
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-green-dim border border-brand-green-dim rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-green">
                  brand-green-dim
                  <br />
                  #00c44e
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-cyan border border-brand-cyan rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-cyan">
                  brand-cyan
                  <br />
                  #00d4ff
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-amber border border-brand-amber rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-amber">
                  brand-amber
                  <br />
                  #f5a623
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-red border border-brand-red rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-red">
                  brand-red
                  <br />
                  #ef4444
                </p>
              </div>

              <div>
                <div className="w-full h-12 bg-brand-blue border border-brand-blue rounded mb-2"></div>
                <p className="font-mono text-xs text-brand-blue">
                  brand-blue
                  <br />
                  #6366f1
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spinners & Loading States */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Loading States</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Spinner Variants</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-text-muted font-sans mb-4">
                  Small Spinner (Default Animation)
                </p>
                <Spinner size="sm" />
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-4">
                  Medium Spinner
                </p>
                <Spinner size="md" />
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-4">
                  Large Spinner with Pulse
                </p>
                <Spinner size="lg" pulse />
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-4">
                  Progress Bar (simulated)
                </p>
                <div className="progress-bar h-1 w-full bg-brand-green rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Animations & Transitions */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Animations</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">Interactive Effects</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-sans mb-3">
                  Hover Effects (smooth lift + glow on buttons/cards)
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="primary">Hover for lift</Button>
                  <Button variant="secondary">Smooth transitions</Button>
                  <Button variant="ghost">Subtle highlight</Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-3">
                  Card Hover (lift + subtle glow)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Card elevated>
                    <CardContent>Hover for lift</CardContent>
                  </Card>
                  <Card elevated>
                    <CardContent>Smooth animation</CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-3">
                  Badge Styling
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">default</Badge>
                  <Badge variant="success">success</Badge>
                  <Badge variant="warning">warning</Badge>
                  <Badge variant="error">error</Badge>
                  <Badge variant="info">info</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-sans mb-3">
                  All animations use smooth cubic-bezier easing and respect prefers-reduced-motion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="font-sans text-brand-green text-lg font-medium mb-6">Features</h2>
        <Card>
          <CardHeader>
            <h3 className="font-sans text-white font-medium">What Makes This Special</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Softened mission control aesthetic — premium dev tool vibes (Linear × Arc × Bloomberg)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Warmer dark backgrounds (#0c0d12 base) with layered depth</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Softened green (#00e85c) — less nuclear, more premium</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Content corners softened (4-8px) while structure stays sharp (0px)</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Geist Sans primary, Geist Mono for data, Instrument Serif for display</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Smooth hover transitions with lift + glow instead of hard state changes</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Opacity-based borders for subtle layering and depth</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="success">✓</Badge>
                <p>Mission control authority preserved, but now it feels designed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-border-default">
        <p className="font-mono text-xs text-text-muted">
          Design System v2.0 • Feb 15, 2026 • Softened Mission Control • Live Build
        </p>
      </div>
    </div>
  );
}
