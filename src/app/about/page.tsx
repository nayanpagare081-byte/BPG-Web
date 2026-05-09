import { Shield, Clock, Globe, Award, Users, Wrench } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--bg-dim), var(--surface))', padding: '100px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 12 }}>About BPG</div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>Built for the Toughest Jobs</h1>
          <p className="body-lg" style={{ color: 'var(--secondary)', maxWidth: 640, margin: '0 auto' }}>
            BPG Construction & Earthmoving Equipment has been India&apos;s trusted partner for heavy machinery procurement, rental, and support services since 2008.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {[
              { icon: <Shield size={32} />, title: 'Our Mission', text: 'To provide contractors and developers with the most reliable, cost-effective earthmoving equipment backed by world-class after-sales support.' },
              { icon: <Award size={32} />, title: 'Our Vision', text: 'To be India\'s most trusted construction equipment partner, recognized for quality, integrity, and rapid service response.' },
              { icon: <Users size={32} />, title: 'Our Values', text: 'Reliability, transparency, and customer success drive every decision. We treat every client relationship as a long-term partnership.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: 32 }}>
                <div style={{ color: 'var(--primary)', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-dim)' }}>
        <div className="container">
          <h2 className="h2" style={{ textAlign: 'center', marginBottom: 48 }}>Why Choose BPG</h2>
          <div className="grid grid-4">
            {[
              { icon: <Clock size={28} />, num: '15+', label: 'Years in Industry' },
              { icon: <Globe size={28} />, num: '500+', label: 'Machines Deployed' },
              { icon: <Users size={28} />, num: '200+', label: 'Active Clients' },
              { icon: <Wrench size={28} />, num: '24/7', label: 'Support Available' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary-light)' }}>{s.num}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
