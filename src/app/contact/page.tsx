'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    setSent(true);
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Get in Touch</div>
          <h1 className="h2">Contact Our Team</h1>
          <p style={{ color: 'var(--secondary)', marginTop: 8 }}>We respond to all inquiries within 24 hours</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Contact Info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
              {[
                { icon: <Phone size={20} />, label: 'Phone', value: '+91 96239 41966', href: 'tel:+919623941966' },
                { icon: <Mail size={20} />, label: 'Email', value: 'Satishpagare2013@gmail.com', href: 'mailto:Satishpagare2013@gmail.com' },
                { icon: <MapPin size={20} />, label: 'Address', value: 'Plot No-26, G, No-82/A-1, Ambad, Nashik 422010, India', href: 'https://maps.app.goo.gl/R52nTpVqJ4rhej469' },
              ].map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} className="card" style={{ display: 'flex', alignItems: 'start', gap: 16, padding: 20, textDecoration: 'none' }}>
                  <div style={{ color: 'var(--primary)', marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div className="label-caps" style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--on-surface)' }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <a href="https://wa.me/qr/CYHYIGHKGCSNO1" target="_blank" className="btn btn-lg" style={{ background: '#25D366', color: '#fff', width: '100%' }}>
              💬 Chat on WhatsApp
            </a>

            {/* Map Embed */}
            <div style={{ marginTop: 24, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', height: 200 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.6!2d73.7!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDU0JzAwLjAiTiA3M8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="200" style={{ border: 0 }} loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 16 }} />
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: 'var(--secondary)' }}>We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Send us a Message</h3>
                {[
                  { key: 'name', label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'phone', label: 'Phone', type: 'tel' },
                ].map(f => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}><Send size={18} /> Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
