import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient/Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[var(--brand-red)] opacity-20 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-0 mix-blend-overlay" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">FLOW</span>.
            <br />
            FEEL THE <span className="text-[var(--brand-red)] neon-text">PULSE</span>.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Akure's premier fitness destination. High-intensity training, yoga, and a community that pushes you further.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-[var(--brand-red)] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:scale-105"
            >
              Start Your Journey
            </Link>
            <Link
              href="/classes"
              className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-[var(--brand-red)] transition-colors group">
              <div className="h-12 w-12 bg-[var(--brand-red)] rounded-lg mb-6 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">High Intensity</h3>
              <p className="text-gray-400">Push your limits with our signature HIIT classes designed to torch calories and build strength.</p>
            </div>
            <div className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-[var(--brand-red)] transition-colors group">
              <div className="h-12 w-12 bg-white rounded-lg mb-6 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-shadow">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">24/7 Access</h3>
              <p className="text-gray-400">Train on your schedule. Our facility is open round the clock for premium members.</p>
            </div>
            <div className="p-8 rounded-2xl glass-panel border border-white/5 hover:border-[var(--brand-red)] transition-colors group">
              <div className="h-12 w-12 bg-[var(--brand-red)] rounded-lg mb-6 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Trainers</h3>
              <p className="text-gray-400">Get personalized guidance from Akure's best fitness professionals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
