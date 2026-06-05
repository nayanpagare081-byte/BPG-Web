'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-outline-variant/40 font-body-sm text-body-sm w-full pt-16 pb-8">
      <div className="max-w-container-max mx-auto px-md grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1: Company Info */}
        <div className="flex flex-col gap-2">
          <img src="/images/logo.png" alt="BPG Logo" className="h-20 md:h-24 w-auto object-contain self-start mb-2" />
          <div className="text-on-surface-variant flex flex-col gap-1 text-sm leading-relaxed">
            <p>Plot No-26, G, No-82/A-1, Ambad,</p>
            <p>Nashik 422010, India</p>
            <p className="mt-2">Phone: +91 96239 41966</p>
            <p>Email: Satishpagare2013@gmail.com</p>
            <p className="mt-1">GSTIN:27**********1ZO</p>
          </div>
        </div>
        
        {/* Column 2: Explore */}
        <div className="flex flex-col gap-3">
          <h4 className="font-button text-sm font-semibold text-on-surface uppercase tracking-wider">Explore</h4>
          <Link href="/" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} className="text-on-surface-variant hover:text-primary transition-colors text-sm">Home</Link>
          <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Shop All</Link>
          <Link href="/consultation" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Request Consultation</Link>
          <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors text-sm">About me</Link>
        </div>

        {/* Column 3: Support */}
        <div className="flex flex-col gap-3">
          <h4 className="font-button text-sm font-semibold text-on-surface uppercase tracking-wider">Support</h4>
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Terms of Service</Link>
          <a href="https://wa.me/919623941966" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm">WhatsApp Support</a>
          <a href="https://maps.google.com/?q=Plot+No-26+Ambad+Nashik" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Find Us on Google Maps</a>
        </div>
        
        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-3">
          <h4 className="font-button text-sm font-semibold text-on-surface uppercase tracking-wider">Newsletter</h4>
          <p className="text-on-surface-variant text-sm leading-relaxed">Subscribe for exclusive access to new collections and equipment updates.</p>
          <form className="flex mt-1">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-grow bg-surface-container-low border border-outline-variant/50 border-r-0 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-outline" 
            />
            <button 
              type="submit" 
              className="bg-primary text-on-primary px-4 py-2 rounded-r font-button text-sm hover:bg-on-surface-variant transition-colors flex items-center justify-center"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Copyright Row */}
        <div className="col-span-1 md:col-span-4 mt-8 pt-6 border-t border-outline-variant/30 text-on-surface-variant text-sm">
          <span>© 2024 BPG Construction & Earthmoving Equipment. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
