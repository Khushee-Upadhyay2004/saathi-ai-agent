import React from 'react';
import { Eye, Ear, Mic, ArrowRight, ShieldCheck, Sparkles, HeartHandshake, Zap, Volume2, Globe, Rocket, CheckCircle2, Clock, Layers, Keyboard, Heart } from 'lucide-react';

export default function LandingPage({ onNavigate, onOpenSponsor, speakText }) {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20 w-full max-w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8 text-center max-w-5xl mx-auto px-3 sm:px-4 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none"></div>

        {/* Accessibility Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-lg animate-pulse-glow max-w-full">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">Universal AI Accessibility Companion</span>
        </div>

        {/* App Name */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-400 tracking-tight mb-3">
          Saathi
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-3xl font-extrabold text-cyan-400 tracking-wide mb-6 font-heading">
          “Aapki har sense, hamesha aapke saath”
        </p>

        {/* One-line Mission Statement */}
        <div className="max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl glass-panel border border-slate-700/60 shadow-xl mb-6">
          <p className="text-base sm:text-xl text-slate-200 font-medium leading-relaxed">
            <span className="text-cyan-300 font-semibold">Mission:</span> “AI that replaces what you can't do, so you never have to depend on someone else.”
          </p>
        </div>

        {/* RAZORPAY BUILDATHON SPONSORSHIP BADGE (HIDDEN) */}
        {/* {onOpenSponsor && (
          <div className="max-w-2xl mx-auto mb-8">
            <button
              onClick={() => {
                onOpenSponsor();
                speakText('Opened Razorpay sponsorship checkout for sponsoring a user');
              }}
              className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/90 via-slate-900/90 to-purple-950/90 border-2 border-pink-500/60 hover:border-pink-400 text-slate-100 shadow-2xl transition-all group flex flex-col sm:flex-row items-center justify-between gap-3 text-left focus:ring-4 focus:ring-pink-400"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 fill-pink-400/40" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                    <span>Razorpay Micro-Sponsorship</span>
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-100">
                    Sponsor a Saathi User for ₹100 / Month
                  </div>
                  <div className="text-xs text-slate-400">
                    Directly funds AI vision & speech processing for an Indian user in need
                  </div>
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-sm whitespace-nowrap shadow-lg group-hover:translate-x-1 transition-transform">
                Sponsor Now (₹100) →
              </div>
            </button>
          </div>
        )} */}

        {/* Key Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Camera AI & Live Vision
          </span>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <Volume2 className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Live Speech Captions & Sound Radar
          </span>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <Mic className="w-4 h-4 text-purple-400 flex-shrink-0" /> Tap-to-Speak Mute Assistance
          </span>
        </div>
      </section>

      {/* PRIMARY ACTIVE FEATURE CARDS SECTION */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 flex items-center justify-center gap-2 sm:gap-3">
            <HeartHandshake className="w-6 sm:w-7 h-6 sm:h-7 text-cyan-400 flex-shrink-0" />
            <span>Select Your Assistance Mode</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-1">
            Tap or use keyboard navigation to launch your real-time AI assistant
          </p>
        </div>

        {/* Responsive Grid: Single column under 600px, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Dekho Mere Liye Card */}
          <div
            onClick={() => {
              speakText('Opening Blind Mode vision assistant');
              onNavigate('dekho');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                speakText('Opening Blind Mode vision assistant');
                onNavigate('dekho');
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Dekho Mere Liye card. Designed for blind and low vision users. Click or press Enter to launch AI Vision Assistant."
            className="glass-panel-interactive card-accessible rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-amber-500/30 hover:border-amber-400 focus:outline-none flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/40">
                  Blind & Low Vision
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors">
                Dekho Mere Liye
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Your visual narrator. Scans surroundings using camera AI, detects obstacles, reads currency notes & text out loud.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-amber-400 font-bold text-base group-hover:translate-x-1 transition-transform min-h-[44px]">
              <span>Launch Blind Mode</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Suno Mere Liye Card */}
          <div
            onClick={() => {
              speakText('Opening Suno Mere Liye hearing assistant');
              onNavigate('suno');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                speakText('Opening Suno Mere Liye hearing assistant');
                onNavigate('suno');
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Suno Mere Liye card. Designed for deaf and hard-of-hearing users. Click or press Enter to launch Speech and Ambient Sound Assistant."
            className="glass-panel-interactive card-accessible rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-emerald-500/30 hover:border-emerald-400 focus:outline-none flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Ear className="w-8 h-8" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                  Deaf & Hard of Hearing
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">
                Suno Mere Liye
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Instant live speech-to-text transcriptions with real-time sound spike alerts & 20 world languages.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-emerald-400 font-bold text-base group-hover:translate-x-1 transition-transform min-h-[44px]">
              <span>Launch Deaf Mode</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Bolo Mere Liye Card */}
          <div
            onClick={() => {
              speakText('Opening Bolo Mere Liye mute speech assistant');
              onNavigate('bolo');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                speakText('Opening Bolo Mere Liye mute speech assistant');
                onNavigate('bolo');
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Bolo Mere Liye card. Designed for mute and speech-impaired users. Click or press Enter to launch Speech Synthesizer."
            className="glass-panel-interactive card-accessible rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-purple-500/30 hover:border-purple-400 focus:outline-none flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/40">
                  Mute & Speech Support
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-100 mb-2 group-hover:text-purple-300 transition-colors">
                Bolo Mere Liye
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Tap-to-speak custom sentences, AAC symbol builder, and quick emergency/daily phrase cards out loud.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-purple-400 font-bold text-base group-hover:translate-x-1 transition-transform min-h-[44px]">
              <span>Launch Mute Mode</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-World Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Built For Uncompromising Independence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Impact Card 1 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-950/40 relative overflow-hidden group hover:border-amber-400/60 transition-all text-center flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-tight">
                Zero Dependence
              </div>
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                No more depending on someone to read a sign, a note, or a message.
              </p>
            </div>
          </div>

          {/* Impact Card 2 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-950/40 relative overflow-hidden group hover:border-cyan-400/60 transition-all text-center flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400 tracking-tight">
                &lt; 3s
              </div>
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                Real-time AI response in under 3 seconds.
              </p>
            </div>
          </div>

          {/* Impact Card 3 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-slate-950/40 relative overflow-hidden group hover:border-purple-400/60 transition-all text-center flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mx-auto flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400 tracking-tight">
                3 • 1 • 3
              </div>
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                3 disabilities, 1 app, 3 languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & VISION SECTION */}
      <section 
        id="about-vision"
        tabIndex={0}
        role="region"
        aria-label="About and Vision Section"
        className="max-w-6xl mx-auto px-3 sm:px-4 pt-4"
      >
        <div className="glass-panel rounded-3xl p-6 sm:p-12 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-8 sm:space-y-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
              <Rocket className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>About & Vision</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              True Independence Through AI
            </h2>

            <p className="text-lg sm:text-2xl text-slate-200 font-medium leading-relaxed border-l-4 border-cyan-400 pl-3 sm:pl-4 py-1">
              "Saathi is built to give people with disabilities true independence using AI — not just assistance, but a real sense replacement, available anytime without needing another person."
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" /> Product Expansion Roadmap
            </h3>

            {/* Timeline Cards: Single column under 768px, 3 cols on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Phase 1 Card */}
              <div className="glass-panel rounded-2xl p-6 border-2 border-emerald-500/60 bg-emerald-950/20 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Phase 1 (Live)
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-100">Live AI Senses</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Blind Mode:</strong> Live camera scene & document description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Deaf Mode:</strong> Live speech captions & audio spike alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Mute Mode:</strong> Tap-to-speak & AAC sentence synthesizer</span>
                  </li>
                </ul>
              </div>

              {/* Phase 2 Card */}
              <div className="glass-panel rounded-2xl p-6 border-2 border-purple-500/40 bg-purple-950/20 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/50 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Phase 2 (Next)
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-100">Cognitive & Sign AI</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>Cognitive Mode:</strong> Task simplification + reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>Sign Language:</strong> Vision recognition to speech</span>
                  </li>
                </ul>
              </div>

              {/* Phase 3 Card */}
              <div className="glass-panel rounded-2xl p-6 border-2 border-cyan-500/40 bg-cyan-950/20 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Phase 3 (Future)
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-100">Universal Ecosystem</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>Offline On-Device AI:</strong> Low-connectivity execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>Wearables:</strong> Smart glasses & haptic wristbands</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSISTENT KEYBOARD SHORTCUTS HINT FOR JUDGES & ACCESSIBILITY */}
      <section className="max-w-4xl mx-auto px-3 sm:px-4 text-center pt-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/40 text-slate-200 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md hover:border-cyan-400 transition-all group">
          <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="text-slate-300 font-medium">Press</span>
          <kbd className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-mono text-xs sm:text-sm font-black shadow-inner tracking-wider">
            Alt + K
          </kbd>
          <span className="text-slate-200 font-bold">anytime to see keyboard shortcuts</span>
        </div>
      </section>
    </div>
  );
}
