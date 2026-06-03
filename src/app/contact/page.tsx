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
    <div className="min-h-screen py-2xl px-margin-mobile bg-slate-50">
      <div className="w-full max-w-container-max mx-auto">
        <div className="text-center mb-2xl">
          <div className="font-label-md text-label-md text-slate-500 uppercase tracking-widest font-bold mb-sm">Get in Touch</div>
          <h1 className="font-headline-lg text-headline-lg text-black tracking-tight">Contact Our Team</h1>
          <p className="font-body-lg text-body-lg text-slate-600 mt-sm">We respond to all inquiries within 24 hours</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Contact Info */}
          <div className="flex flex-col gap-xl">
            <div className="flex flex-col gap-md">
              {[
                { icon: <Phone size={24} strokeWidth={1.5} />, label: 'Phone', value: '+91 96239 41966', href: 'tel:+919623941966' },
                { icon: <Mail size={24} strokeWidth={1.5} />, label: 'Email', value: 'Satishpagare2013@gmail.com', href: 'mailto:Satishpagare2013@gmail.com' },
                { icon: <MapPin size={24} strokeWidth={1.5} />, label: 'Address', value: 'Plot No-26, G, No-82/A-1, Ambad, Nashik 422010, India', href: 'https://maps.app.goo.gl/R52nTpVqJ4rhej469' },
              ].map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} className="bg-white border border-slate-200 rounded-xl p-md flex items-start gap-md hover:shadow-md transition-shadow duration-200 no-underline">
                  <div className="text-black bg-slate-100 p-sm rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                  <div>
                    <div className="font-label-sm text-label-sm text-slate-500 uppercase tracking-widest font-bold mb-1">{item.label}</div>
                    <div className="font-body-md text-body-md text-black font-medium">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
            
            <a href="https://wa.me/qr/CYHYIGHKGCSNO1" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-sm bg-[#25D366] hover:bg-[#1DA851] text-white font-button text-button py-[16px] px-lg rounded transition-colors duration-200">
              <span className="text-xl">💬</span>
              <span>Chat on WhatsApp</span>
            </a>

            {/* Map Embed */}
            <div className="w-full rounded-xl overflow-hidden h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.6!2d73.7!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDU0JzAwLjAiTiA3M8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="BPG Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-xl">
            {sent ? (
              <div className="text-center py-2xl flex flex-col items-center">
                <CheckCircle size={64} className="text-green-500 mb-md" strokeWidth={1.5} />
                <h3 className="font-headline-sm text-headline-sm text-black mb-xs">Message Sent!</h3>
                <p className="font-body-md text-body-md text-slate-600">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                <h3 className="font-headline-sm text-headline-sm text-black mb-sm">Send us a Message</h3>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rajesh Kumar' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'rajesh@company.com' },
                  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                ].map(f => (
                  <div className="flex flex-col gap-xs" key={f.key}>
                    <label className="font-label-md text-label-md text-slate-700 font-bold">{f.label}</label>
                    <input 
                      type={f.type} 
                      value={form[f.key as keyof typeof form]} 
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} 
                      placeholder={f.placeholder}
                      required 
                      className="w-full px-md py-[12px] bg-slate-50 border border-slate-300 rounded text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-xs mb-sm">
                  <label className="font-label-md text-label-md text-slate-700 font-bold">Message</label>
                  <textarea 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    rows={5} 
                    placeholder="How can we help you?"
                    required 
                    className="w-full px-md py-[12px] bg-slate-50 border border-slate-300 rounded text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors resize-y"
                  />
                </div>
                <button type="submit" className="w-full bg-black hover:bg-slate-800 text-white font-button text-button py-[16px] px-lg rounded flex items-center justify-center gap-sm transition-colors duration-200">
                  <Send size={20} strokeWidth={2} /> 
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
