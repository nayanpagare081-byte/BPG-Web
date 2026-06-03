'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ConsultationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex-grow bg-[#F8F9FA] min-h-[70vh] flex flex-col items-center justify-center py-xl px-margin-mobile">
        <div className="max-w-[600px] w-full text-center flex flex-col items-center gap-md p-xl bg-white border border-outline-variant/30 rounded-lg shadow-sm animate-fade-in-up">
          <span className="material-symbols-outlined text-green-500 text-[80px] rounded-full p-2 bg-green-50">check_circle</span>
          <h1 className="font-headline-md md:font-display-sm text-primary mt-sm">Consultation Requested!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Thank you for reaching out. Our engineering team has received your project details and will contact you shortly to optimize your fleet solutions.
          </p>
          <div className="mt-md w-full">
            <Link
              href="/"
              className="btn-ripple bg-primary text-on-primary font-button text-button py-sm px-lg rounded hover:bg-on-surface-variant transition-colors text-center font-semibold"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Project Consultation Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 flex flex-col items-center animate-fade-in-up">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Project Consultation</h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl font-light">
            Precision engineering meets strategic planning. Let our experts optimize your next large-scale operation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 md:p-10 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Details</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input required type="text" placeholder="e.g. Alexander Sterling" className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                <input required type="text" placeholder="Global Infrastructure Corp" className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input required type="email" placeholder="a.sterling@company.com" className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50" />
              </div>
            </div>

            {/* Project Type */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Type</label>
              <select className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50 appearance-none cursor-pointer">
                <option>Earthmoving & Grading</option>
                <option>Road Construction</option>
                <option>Mining Operations</option>
                <option>Urban Development</option>
                <option>Industrial Facility</option>
              </select>
            </div>

            {/* Machinery Categories */}
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Required Machinery Categories</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Excavators', 'Loaders', 'Dozers', 'Graders', 'Haul Trucks', 'Compactors'].map(category => (
                  <label key={category} className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50/30 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#1A1F2C] border-gray-300 rounded focus:ring-[#1A1F2C]" />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specific Requirements & Notes</label>
              <textarea 
                rows={4} 
                placeholder="Describe the site conditions, specific attachments needed, or operational constraints..."
                className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50/50 resize-none"
              ></textarea>
            </div>

            {/* Communication Channel */}
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Communication Channel</label>
              <div className="flex items-center gap-6">
                {['Email', 'Phone Call', 'WhatsApp'].map(channel => (
                  <label key={channel} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="commChannel" defaultChecked={channel === 'Email'} className="w-4 h-4 text-[#1A1F2C] border-gray-300 focus:ring-[#1A1F2C]" />
                    <span className="text-sm text-gray-700">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-6 w-full bg-[#111625] hover:bg-[#1a2138] text-white font-bold py-4 rounded text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <>
                  <span>Submit Consultation Request</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="bg-[#151923] rounded-lg p-8 text-white shadow-xl sticky top-24">
          <h2 className="text-xl font-bold mb-8">Why Consult with BPG?</h2>
          
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-gray-300 text-[24px]">verified</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-gray-100">Expert Technical Assessment</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  On-site evaluations by senior engineers to determine optimal machinery configurations.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-gray-300 text-[24px]">handyman</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-gray-100">Customized Fleet Solutions</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Tailored acquisition and rental plans designed for project-specific ROI.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-gray-300 text-[24px]">architecture</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-gray-100">Comprehensive Planning</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Logistics, maintenance scheduling, and safety compliance integration from day one.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
