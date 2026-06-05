import React from 'react';

export const metadata = {
  title: 'Terms of Service | BPG Equipment',
  description: 'Terms of Service for BPG Construction & Earthmoving Equipment',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-surface min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-[104px]">
      <div className="max-w-3xl mx-auto glass-panel p-8 md:p-12 rounded-2xl">
        <h1 className="text-4xl font-display-lg text-primary mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-on-surface-variant max-w-none">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on BPG Construction & Earthmoving Equipment's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">3. Equipment Quotes and Pricing</h2>
            <p>
              All equipment specifications, availability, and quotes requested through our website are subject to confirmation. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information or cancel quotes if any information is inaccurate at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">4. Limitations</h2>
            <p>
              In no event shall BPG Construction & Earthmoving Equipment or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Nashik, Maharashtra.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-4">6. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="mt-4 p-4 bg-surface-container rounded-lg">
              <p>Email: Satishpagare2013@gmail.com</p>
              <p>Phone: +91 96239 41966</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
