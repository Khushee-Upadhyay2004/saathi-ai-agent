import React, { useEffect, useState } from 'react';
import { Sparkles, HeartHandshake } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1800);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 select-none ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
      role="banner"
      aria-label="Saathi intro splash screen loading"
    >
      {/* Background glow circle */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 space-y-6 animate-in zoom-in-95 duration-500">
        {/* Animated App Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-purple-500 p-0.5 shadow-2xl animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-cyan-400">
            <HeartHandshake className="w-12 h-12" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-400">
          Saathi
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-extrabold text-cyan-300 tracking-wide font-heading">
          “Aapki har sense, hamesha aapke saath”
        </p>

        {/* Loading Spinner Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="w-3 h-3 rounded-full bg-teal-400 animate-ping delay-100"></span>
          <span className="w-3 h-3 rounded-full bg-purple-400 animate-ping delay-200"></span>
        </div>
      </div>
    </div>
  );
}
