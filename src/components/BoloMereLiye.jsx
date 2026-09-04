import React, { useState, useEffect, useCallback } from 'react';
import { Mic, ArrowLeft, Volume2, Sparkles, MessageSquare, Trash2, Zap, Sliders } from 'lucide-react';

const REQUIRED_QUICK_PHRASES = [
  { id: 1, text: 'Mujhe madad chahiye', english: 'I need help', cat: 'Emergency', color: 'bg-red-500/20 border-red-400 text-red-300' },
  { id: 2, text: 'Haan', english: 'Yes', cat: 'Simple', color: 'bg-emerald-500/20 border-emerald-400 text-emerald-300' },
  { id: 3, text: 'Nahi', english: 'No', cat: 'Simple', color: 'bg-rose-500/20 border-rose-400 text-rose-300' },
  { id: 4, text: 'Dhanyawad', english: 'Thank you', cat: 'Simple', color: 'bg-cyan-500/20 border-cyan-400 text-cyan-300' },
  { id: 5, text: 'Ruko please', english: 'Please wait', cat: 'Daily', color: 'bg-amber-500/20 border-amber-400 text-amber-300' },
  { id: 6, text: 'Paani chahiye', english: 'I need water', cat: 'Daily', color: 'bg-blue-500/20 border-blue-400 text-blue-300' },
  { id: 7, text: 'Kahan hain aap?', english: 'Where are you?', cat: 'Daily', color: 'bg-purple-500/20 border-purple-400 text-purple-300' },
  { id: 8, text: 'Doctor ko bulao', english: 'Call the doctor', cat: 'Emergency', color: 'bg-red-950 border-red-500 text-red-200' },
  { id: 9, text: 'Khana chahiye', english: 'I need food', cat: 'Daily', color: 'bg-orange-500/20 border-orange-400 text-orange-300' },
  { id: 10, text: 'Sauchalay kahan hai?', english: 'Where is the restroom?', cat: 'Daily', color: 'bg-teal-500/20 border-teal-400 text-teal-300' }
];

const AAC_WORDS = [
  { word: 'Mujhe', english: 'I' },
  { word: 'Aap', english: 'You' },
  { word: 'Chahiye', english: 'Want' },
  { word: 'Paani', english: 'Water' },
  { word: 'Khana', english: 'Food' },
  { word: 'Madad', english: 'Help' },
  { word: 'Doctor', english: 'Doctor' },
  { word: 'Restroom', english: 'Restroom' },
  { word: 'Haan', english: 'Yes' },
  { word: 'Nahi', english: 'No' },
  { word: 'Kahan', english: 'Where' },
  { word: 'Dhanyawad', english: 'Thanks' }
];

export default function BoloMereLiye({ onBack, speakText, language }) {
  const [customText, setCustomText] = useState('');
  const [builtSentence, setBuiltSentence] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [voiceRate, setVoiceRate] = useState(0.85); // Explicit requirement: default rate = 0.85

  // Explicitly Configured Speech Synthesis helper for Mute Mode
  const speakConfiguredText = useCallback((textToSpeak) => {
    if (!textToSpeak || !textToSpeak.trim()) return;
    const trimmedText = textToSpeak.trim();

    if ('speechSynthesis' in window) {
      // REQUIREMENT: Clear any overlapping previous speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(trimmedText);
      const isHindiText = /[\u0900-\u097F]/.test(trimmedText) || 
        ['Mujhe', 'Haan', 'Nahi', 'Dhanyawad', 'Ruko', 'Paani', 'Kahan', 'Doctor', 'Khana', 'Sauchalay'].some(w => trimmedText.includes(w));

      const targetLang = isHindiText ? 'hi-IN' : (language === 'hi-IN' ? 'hi-IN' : 'en-US');

      // REQUIREMENT: Explicitly set lang, rate = 0.85, pitch = 1.0, volume = 1.0
      utterance.lang = targetLang;
      utterance.rate = voiceRate || 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // REQUIREMENT: Explicit voice selection preferring "Google" voice, fallback to matching lang
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = targetLang.split('-')[0].toLowerCase();
        const matchingVoices = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));

        const preferredVoice = matchingVoices.find(v => v.name.includes('Google'))
          || matchingVoices[0]
          || voices.find(v => v.lang && v.lang.startsWith('en'))
          || voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log(`[Bolo Mere Liye TTS] Speaking "${trimmedText}" with voice: "${preferredVoice.name}" (${preferredVoice.lang})`);
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [voiceRate, language]);

  const handleAddAACWord = (wordObj) => {
    setBuiltSentence(prev => [...prev, wordObj.word]);
  };

  const handleSpeakBuiltSentence = () => {
    if (builtSentence.length === 0) return;
    const fullText = builtSentence.join(' ');
    speakConfiguredText(fullText);
  };

  const filteredPhrases = activeCategory === 'All'
    ? REQUIRED_QUICK_PHRASES
    : REQUIRED_QUICK_PHRASES.filter(p => p.cat === activeCategory);

  return (
    <div 
      className="max-w-6xl mx-auto px-3 sm:px-4 pb-20 space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full max-w-full overflow-x-hidden"
      role="main"
      aria-label="Saathi Mute Mode Speech Assistant Screen"
    >
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2 border-b border-slate-800 w-full">
        <button
          onClick={() => {
            speakConfiguredText('Exiting Mute Mode');
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-medium transition-all focus:ring-2 focus:ring-purple-400 min-h-[44px]"
          aria-label="Back to home landing page (Alt+H)"
        >
          <ArrowLeft className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Bolo Mere Liye</h1>
            <p className="text-[10px] sm:text-xs text-purple-400 font-medium">Mute Mode • High Clarity Speech Synthesizer</p>
          </div>
        </div>

        {/* BUG FIX #2: Voice Speed Range Slider (0.5x to 1.5x, Default 0.9) */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 min-h-[44px]">
          <Sliders className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="whitespace-nowrap">Speech Speed ({voiceRate}x):</span>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={voiceRate}
            onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
            className="w-24 sm:w-28 accent-purple-400 cursor-pointer"
            aria-label="Voice speed slider range 0.5 to 1.5"
          />
        </div>
      </div>

      {/* SECTION 1: CUSTOM TEXT INPUT + "SPEAK OUT LOUD" BUTTON */}
      <div className="glass-panel p-4 sm:p-8 rounded-3xl border-2 border-purple-500/40 shadow-2xl space-y-4 w-full">
        <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span>Type & Speak Out Loud</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                speakConfiguredText(customText);
              }
            }}
            placeholder="Type any sentence to speak..."
            className="flex-1 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium min-h-[52px]"
            aria-label="Custom speech text input"
          />

          <button
            onClick={() => speakConfiguredText(customText)}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-base sm:text-lg transition-all shadow-xl focus:ring-4 focus:ring-purple-300 flex items-center justify-center gap-2 min-h-[52px]"
            aria-label="Speak Typed Text Out Loud button"
          >
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Speak</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: AAC SYMBOL / TAP-TO-BUILD SENTENCE GRID */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" /> AAC Sentence Builder
          </h3>

          {builtSentence.length > 0 && (
            <button
              onClick={() => setBuiltSentence([])}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold min-h-[44px]"
              aria-label="Clear built sentence"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 min-h-[64px]">
          <div className="flex flex-wrap items-center gap-2">
            {builtSentence.length === 0 ? (
              <span className="text-slate-500 text-xs sm:text-sm italic">Tap words below to construct a sentence...</span>
            ) : (
              builtSentence.map((w, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-200 font-bold text-sm sm:text-base shadow">
                  {w}
                </span>
              ))
            )}
          </div>

          {builtSentence.length > 0 && (
            <button
              onClick={handleSpeakBuiltSentence}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow focus:ring-2 focus:ring-cyan-300 flex items-center gap-1.5 min-h-[44px]"
              aria-label="Speak built sentence out loud"
            >
              <Volume2 className="w-4 h-4" />
              <span>Speak Sentence</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {AAC_WORDS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAddAACWord(item)}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:border-purple-400 text-center transition-all min-h-[52px]"
              aria-label={`Add word ${item.word}`}
            >
              <div className="font-extrabold text-sm sm:text-base text-slate-100">{item.word}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400">{item.english}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: QUICK-PHRASE BUTTONS GRID */}
      <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-slate-800 space-y-4 sm:space-y-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400 flex-shrink-0" /> Quick Spoken Phrase Cards
            </h2>
            <p className="text-slate-400 text-xs">Tap any card to speak out loud instantly</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
            {['All', 'Emergency', 'Daily', 'Simple'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all min-h-[36px] ${
                  activeCategory === cat
                    ? 'bg-purple-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={`Filter phrases by ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredPhrases.map((phrase) => (
            <button
              key={phrase.id}
              onClick={() => speakConfiguredText(phrase.text)}
              className={`p-3.5 sm:p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.03] active:scale-95 shadow-lg min-h-[88px] flex flex-col justify-between ${phrase.color}`}
              aria-label={`Speak phrase: ${phrase.text} (${phrase.english})`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
                  {phrase.cat}
                </span>
                <Volume2 className="w-4 h-4 opacity-80 flex-shrink-0" />
              </div>
              <div>
                <div className="text-base sm:text-xl font-black tracking-tight leading-tight">{phrase.text}</div>
                <div className="text-[10px] sm:text-xs opacity-75 italic mt-0.5">{phrase.english}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
