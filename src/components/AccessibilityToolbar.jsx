import React from 'react';
import { Volume2, VolumeX, Type, Sun, Keyboard, Sparkles, Languages, ShieldCheck, Heart } from 'lucide-react';

export default function AccessibilityToolbar({
  highContrast,
  setHighContrast,
  textSize,
  setTextSize,
  voiceAnnounce,
  setVoiceAnnounce,
  onOpenShortcuts,
  onOpenSponsor,
  language,
  setLanguage,
  demoMode,
  setDemoMode,
  speakText
}) {
  const toggleHighContrast = () => {
    let nextMode = 'normal';
    if (highContrast === 'normal') nextMode = 'yellow';
    else if (highContrast === 'yellow') nextMode = 'white';
    else nextMode = 'normal';

    setHighContrast(nextMode);

    document.body.classList.remove('high-contrast-yellow', 'high-contrast-white');
    if (nextMode === 'yellow') {
      document.body.classList.add('high-contrast-yellow');
      speakText('High contrast mode set to Yellow on Black');
    } else if (nextMode === 'white') {
      document.body.classList.add('high-contrast-white');
      speakText('High contrast mode set to White on Black');
    } else {
      speakText('Standard dark mode active');
    }
  };

  const cycleTextSize = () => {
    let nextSize = 'normal';
    if (textSize === 'normal') nextSize = 'lg';
    else if (textSize === 'lg') nextSize = 'xl';
    else nextSize = 'normal';

    setTextSize(nextSize);
    document.body.classList.remove('text-scale-lg', 'text-scale-xl');
    if (nextSize === 'lg') {
      document.body.classList.add('text-scale-lg');
      speakText('Text size increased to Large');
    } else if (nextSize === 'xl') {
      document.body.classList.add('text-scale-xl');
      speakText('Text size increased to Extra Large');
    } else {
      speakText('Text size reset to Normal');
    }
  };

  const toggleVoice = () => {
    const nextVal = !voiceAnnounce;
    setVoiceAnnounce(nextVal);
    if (nextVal) {
      speakText('Screen voice narration enabled. I will read important screen updates aloud.');
    } else {
      speakText('Voice narration muted.');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-3 sm:px-4 py-2.5 shadow-2xl w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Quick Accessibility Controls Header */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest self-start sm:self-center">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Accessibility Suite Active</span>
        </div>

        {/* Action Controls Flex Wrap Container */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end">
          {/* Razorpay Sponsor Micro-Donation Trigger (HIDDEN) */}
          {/* {onOpenSponsor && (
            <button
              onClick={() => {
                onOpenSponsor();
                speakText('Opened Razorpay Sponsor a User modal');
              }}
              aria-label="Sponsor a Saathi User micro-donation via Razorpay"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-950/80 hover:bg-pink-900 border border-pink-500/60 text-pink-200 text-xs sm:text-sm font-bold transition-all focus:ring-2 focus:ring-pink-400 min-h-[44px] shadow-lg shadow-pink-950/50 animate-pulse"
            >
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 flex-shrink-0" />
              <span className="whitespace-nowrap">Sponsor ₹100 (Razorpay)</span>
            </button>
          )} */}

          {/* Contrast Switcher */}
          <button
            onClick={toggleHighContrast}
            aria-label={`Current contrast mode: ${highContrast}. Press to toggle yellow or white high contrast mode.`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-medium transition-all focus:ring-2 focus:ring-cyan-400 min-h-[44px]"
          >
            <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {highContrast === 'normal' ? 'Standard' : highContrast === 'yellow' ? 'Yellow/Black' : 'White/Black'}
            </span>
          </button>

          {/* Text Scaler */}
          <button
            onClick={cycleTextSize}
            aria-label={`Current text size: ${textSize}. Press to change text scaling.`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-medium transition-all focus:ring-2 focus:ring-cyan-400 min-h-[44px]"
          >
            <Type className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Text: {textSize.toUpperCase()}</span>
          </button>

          {/* Voice Narrator Toggle */}
          <button
            onClick={toggleVoice}
            aria-label={voiceAnnounce ? "Voice narrator enabled. Click to mute." : "Voice narrator muted. Click to enable audio narration."}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border focus:ring-2 focus:ring-cyan-400 min-h-[44px] ${
              voiceAnnounce
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {voiceAnnounce ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" /> : <VolumeX className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            <span className="whitespace-nowrap">Voice: {voiceAnnounce ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={() => {
              const nextLang = language === 'hi-IN' ? 'en-US' : language === 'en-US' ? 'hinglish' : 'hi-IN';
              setLanguage(nextLang);
              speakText(`Language set to ${nextLang === 'hi-IN' ? 'Hindi' : nextLang === 'en-US' ? 'English' : 'Hinglish'}`);
            }}
            aria-label={`Language mode: ${language}. Click to change language.`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-medium transition-all focus:ring-2 focus:ring-cyan-400 min-h-[44px]"
          >
            <Languages className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="whitespace-nowrap">{language === 'hi-IN' ? 'हिंदी' : language === 'en-US' ? 'English' : 'Hinglish'}</span>
          </button>

          {/* Subtle Demo Fail-Safe Toggle */}
          <button
            onClick={() => {
              const nextDemo = !demoMode;
              if (setDemoMode) setDemoMode(nextDemo);
              speakText(`Demo fail safe mode ${nextDemo ? 'active' : 'disabled'}`);
            }}
            title="Demo Mode: Auto-recovers with fallback AI response if API fails or network is slow"
            aria-label={`Demo Mode is ${demoMode ? 'ON' : 'OFF'}. Click to toggle.`}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border focus:ring-2 focus:ring-amber-400 min-h-[44px] ${
              demoMode
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Demo Mode: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Shortcuts Guide Button */}
          <button
            onClick={onOpenShortcuts}
            aria-label="View keyboard shortcuts guide (Alt Key plus shortcut letter)"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs sm:text-sm font-medium transition-all focus:ring-2 focus:ring-cyan-400 min-h-[44px]"
          >
            <Keyboard className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Shortcuts</span>
          </button>
        </div>
      </div>
    </header>
  );
}
