import CTAButtons from './components/CTAButtons'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0b1215',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle dot pattern background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
      
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '900px',
      }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: '72px',
            fontWeight: '400',
            color: '#f0f5f1',
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Brumello ❄️
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#8a9b91',
            fontWeight: '400',
            marginBottom: '24px',
            letterSpacing: '-0.01em',
          }}>
            Task management for the agent development era
          </p>
        </div>

        {/* Value Prop */}
        <div style={{
          marginBottom: '48px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <p style={{
            fontSize: '18px',
            color: '#c8d5cc',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}>
            Task management built for the AI agent era
          </p>
          <p style={{
            fontSize: '16px',
            color: '#8a9b91',
            lineHeight: '1.6',
          }}>
            Designed for autonomous workflows, built with modern tooling. Manage tasks the way agents think.
          </p>
        </div>

        {/* CTA Buttons */}
        <CTAButtons />

        {/* Footer note */}
        <div style={{
          marginTop: '64px',
          fontSize: '14px',
          color: '#8a9b91',
        }}>
          <p>Built with ❄️ by Brumalia</p>
        </div>
      </div>
    </main>
  )
}
