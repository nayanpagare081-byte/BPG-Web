import { Shield, Clock, Globe, Award, Users, Wrench } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 px-margin-mobile">
        <div className="w-full max-w-container-max mx-auto text-center flex flex-col items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest mb-2 font-semibold">About BPG</div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-4 max-w-2xl">Built for the Toughest Jobs</h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            BPG Construction & Earthmoving Equipment has been a trusted partner for heavy machinery procurement, and support services since 2024.
          </p>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 px-margin-mobile bg-white">
        <div className="w-full max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              { icon: <Shield size={24} strokeWidth={1.5} />, title: 'Our Mission', text: 'To provide contractors and developers with the most reliable, cost-effective earthmoving equipment backed by world-class after-sales support.' },
              { icon: <Award size={24} strokeWidth={1.5} />, title: 'Our Vision', text: 'To be India\'s most trusted construction equipment partner, recognized for quality, integrity, and rapid service response.' },
              { icon: <Users size={24} strokeWidth={1.5} />, title: 'Our Values', text: 'Reliability, transparency, and customer success drive every decision. We treat every client relationship as a long-term partnership.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center h-full">
                <div className="text-black mb-3 bg-slate-100 p-2 rounded-lg inline-flex">{item.icon}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-margin-mobile bg-slate-900 text-white">
        <div className="w-full max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-center mb-xl">Why Choose BPG</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg md:gap-xl">
            {[
              { icon: <Clock size={28} strokeWidth={1.5} />, num: '2+', label: 'Years in Industry' },
              { icon: <Globe size={28} strokeWidth={1.5} />, num: '350+', label: 'Machines Deployed' },
              { icon: <Users size={28} strokeWidth={1.5} />, num: '200+', label: 'Active Clients' },
              { icon: <Wrench size={28} strokeWidth={1.5} />, num: '24/7', label: 'Support Available' },
            ].map((s, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="text-slate-400 mb-sm">{s.icon}</div>
                <div className="font-headline-lg text-headline-lg font-bold text-white mb-xs tracking-tight">{s.num}</div>
                <div className="font-label-sm text-label-sm text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
