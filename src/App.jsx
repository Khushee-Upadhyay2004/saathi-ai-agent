import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import LandingPage from './components/LandingPage';
import DekhoMereLiye from './components/DekhoMereLiye';
import SunoMereLiye from './components/SunoMereLiye';
import BoloMereLiye from './components/BoloMereLiye';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import SponsorModal from './components/SponsorModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'dekho' | 'suno' | 'bolo'
  const [highContrast, setHighContrast] = useState('normal'); // 'normal' | 'yellow' | 'white'
  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'lg' | 'xl'
  const [voiceAnnounce, setVoiceAnnounce] = useState(true);
  const [language, setLanguage] = useState('en-US'); // 'en-US' | 'hi-IN' | 'hinglish'
  const [demoMode, setDemoMode] = useState(true); // Default true for bulletproof live demos
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const [voices, setVoices] = useState([]);

  // Load voices asynchronously via onvoiceschanged listener
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
        console.log('[Saathi TTS] Voices loaded:', availableVoices.length);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Voice Selection logic preferring "Google" voices matching target language
  const selectBestVoice = useCallback((langCode) => {
    const availableVoices = voices.length > 0
      ? voices
      : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);

    if (!availableVoices || availableVoices.length === 0) return null;

    const targetLangStr = (langCode || 'en-US').toLowerCase();
    const targetPrefix = targetLangStr.split('-')[0];

    const matchingVoices = availableVoices.filter(v =>
      v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(targetPrefix)
    );

    // 1. Prefer voice with "Google" in the name for maximum clarity
    const googleVoice = matchingVoices.find(v => v.name.includes('Google'));
    if (googleVoice) return googleVoice;

    // 2. Prefer voice with "Natural" or "Neural" in name
    const naturalVoice = matchingVoices.find(v => v.name.includes('Natural') || v.name.includes('Neural'));
    if (naturalVoice) return naturalVoice;

    // 3. Fallback to any voice for this language prefix
    if (matchingVoices.length > 0) return matchingVoices[0];

    // 4. Default fallback voice
    return availableVoices[0];
  }, [voices]);

  // Unified Speech Synthesis helper used across all app modes
  const speakText = useCallback((text, langCodeParam, customRate) => {
    setLiveAnnouncement(text);
    if (!voiceAnnounce || !('speechSynthesis' in window) || !text || !text.trim()) return;

    // Call cancel() before starting a new utterance to prevent speech overlap or audio garbling
    window.speechSynthesis.cancel();

    const cleanText = text.trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Explicit requirements: rate = 0.85 (or custom rate if specified), pitch = 1.0, volume = 1.0
    utterance.rate = typeof customRate === 'number' ? customRate : (typeof langCodeParam === 'number' ? langCodeParam : 0.85);
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Determine target language
    let targetLang = language || 'en-US';
    if (typeof langCodeParam === 'string' && langCodeParam.trim().length > 0) {
      targetLang = langCodeParam.trim();
    } else {
      const isHindiText = /[\u0900-\u097F]/.test(cleanText) ||
        ['Mujhe', 'Haan', 'Nahi', 'Dhanyawad', 'Ruko', 'Paani', 'Kahan', 'Doctor', 'Khana', 'Sauchalay', 'Namaste'].some(w => cleanText.includes(w));
      if (isHindiText) {
        targetLang = 'hi-IN';
      }
    }

    const selectedVoice = selectBestVoice(targetLang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
      console.log(`[Saathi TTS] Speaking with voice: "${selectedVoice.name}" (${selectedVoice.lang}) for text: "${cleanText.slice(0, 30)}..."`);
    } else {
      utterance.lang = targetLang;
    }

    window.speechSynthesis.speak(utterance);
  }, [voiceAnnounce, language, selectBestVoice]);

  // Keyboard Shortcuts Global Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            setCurrentPage('landing');
            speakText('Navigated to Saathi Home Landing Page');
            break;
          case 'v':
            e.preventDefault();
            setCurrentPage('dekho');
            speakText('Navigated to Blind Mode vision assistant');
            break;
          case 'a':
            e.preventDefault();
            setCurrentPage('suno');
            speakText('Navigated to Deaf Mode hearing assistant');
            break;
          case 'b':
            e.preventDefault();
            setCurrentPage('bolo');
            speakText('Navigated to Mute Mode speech assistant');
            break;
          case 'c':
            e.preventDefault();
            const nextMode = highContrast === 'normal' ? 'yellow' : highContrast === 'yellow' ? 'white' : 'normal';
            setHighContrast(nextMode);
            document.body.classList.remove('high-contrast-yellow', 'high-contrast-white');
            if (nextMode === 'yellow') document.body.classList.add('high-contrast-yellow');
            if (nextMode === 'white') document.body.classList.add('high-contrast-white');
            speakText(`Contrast toggled to ${nextMode}`);
            break;
          case 's':
            e.preventDefault();
            const nextVoice = !voiceAnnounce;
            setVoiceAnnounce(nextVoice);
            speakText(`Voice narrator ${nextVoice ? 'enabled' : 'muted'}`);
            break;
          case 'k':
            e.preventDefault();
            setIsShortcutsOpen(prev => !prev);
            speakText('Toggled keyboard shortcuts modal');
            break;
          case 'p':
            e.preventDefault();
            setIsSponsorModalOpen(prev => !prev);
            speakText('Toggled Razorpay sponsor a user modal');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highContrast, voiceAnnounce, speakText]);

  return (
    <ErrorBoundary>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
        {/* Hide Accessibility Toolbar when inside full-screen Blind Mode */}
        {currentPage !== 'dekho' && (
          <AccessibilityToolbar
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            textSize={textSize}
            setTextSize={setTextSize}
            voiceAnnounce={voiceAnnounce}
            setVoiceAnnounce={setVoiceAnnounce}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenSponsor={() => setIsSponsorModalOpen(true)}
            language={language}
            setLanguage={setLanguage}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
            speakText={speakText}
          />
        )}

        {/* Screen Reader Live Region */}
        <div 
          aria-live="assertive" 
          className="sr-only"
          aria-atomic="true"
        >
          {liveAnnouncement}
        </div>

        {/* Main Content Router */}
        <main className={`flex-1 ${currentPage === 'dekho' ? 'p-0 max-w-none w-full' : 'max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8'}`}>
          {currentPage === 'landing' && (
            <LandingPage 
              onNavigate={(page) => setCurrentPage(page)} 
              onOpenSponsor={() => setIsSponsorModalOpen(true)}
              speakText={speakText} 
            />
          )}

          {currentPage === 'dekho' && (
            <DekhoMereLiye 
              onBack={() => setCurrentPage('landing')} 
              speakText={speakText}
              language={language}
              demoMode={demoMode}
            />
          )}

          {currentPage === 'suno' && (
            <SunoMereLiye 
              onBack={() => setCurrentPage('landing')} 
              speakText={speakText}
            />
          )}

          {currentPage === 'bolo' && (
            <BoloMereLiye 
              onBack={() => setCurrentPage('landing')} 
              speakText={speakText}
              language={language}
            />
          )}
        </main>

        {/* Footer */}
        {currentPage !== 'dekho' && (
          <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-sm text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-cyan-400 text-lg">Saathi</span>
                <span className="text-slate-500">|</span>
                <span className="italic">“Aapki har sense, hamesha aapke saath”</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                {/* <button
                  onClick={() => setIsSponsorModalOpen(true)}
                  className="font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
                >
                  <span>♥ Sponsor a User (Razorpay)</span>
                </button>
                <span className="text-slate-600">•</span> */}
                <p className="text-slate-400">
                  WCAG 2.1 AAA Compliant
                </p>
              </div>
            </div>
          </footer>
        )}

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal 
          isOpen={isShortcutsOpen} 
          onClose={() => setIsShortcutsOpen(false)} 
          speakText={speakText}
        />

        {/* Razorpay Sponsorship Modal (HIDDEN) */}
        {/* <SponsorModal
          isOpen={isSponsorModalOpen}
          onClose={() => setIsSponsorModalOpen(false)}
          speakText={speakText}
        /> */}
      </div>
    </ErrorBoundary>
  );
}
