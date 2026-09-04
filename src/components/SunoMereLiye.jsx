import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ear, ArrowLeft, Mic, MicOff, ShieldAlert, Settings, Download, Copy, Check, Bell, Languages, Chrome } from 'lucide-react';
import PermissionModal from './PermissionModal';

export const WORLD_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'es-ES', name: 'Español (Spanish)' },
  { code: 'fr-FR', name: 'Français (French)' },
  { code: 'de-DE', name: 'Deutsch (German)' },
  { code: 'zh-CN', name: '中文 (Mandarin)' },
  { code: 'ar-SA', name: 'العربية (Arabic)' },
  { code: 'pt-PT', name: 'Português (Portuguese)' },
  { code: 'ru-RU', name: 'Русский (Russian)' },
  { code: 'ja-JP', name: '日本語 (Japanese)' },
  { code: 'ko-KR', name: '한국어 (Korean)' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  { code: 'ur-PK', name: 'اردو (Urdu)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'mr-IN', name: 'मराठी (Marathi)' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'it-IT', name: 'Italiano (Italian)' },
  { code: 'tr-TR', name: 'Türkçe (Turkish)' }
];

const SOUND_SIMULATIONS = [
  { id: 'siren', name: 'Emergency Siren', level: 'CRITICAL', color: 'bg-red-500/30 border-red-500 text-red-300', dir: 'RIGHT OUTSIDE' },
  { id: 'doorbell', name: 'Doorbell Ringing', level: 'ALERT', color: 'bg-amber-500/20 border-amber-400 text-amber-300', dir: 'FRONT DOOR' },
  { id: 'knock', name: 'Door Knocking', level: 'NOTICE', color: 'bg-blue-500/20 border-blue-400 text-blue-300', dir: 'LEFT SIDE' },
  { id: 'alarm', name: 'Alarm Clock', level: 'NOTICE', color: 'bg-purple-500/20 border-purple-400 text-purple-300', dir: 'BEDROOM' }
];

export default function SunoMereLiye({ onBack, speakText }) {
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isListening, setIsListening] = useState(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
  const [unsupportedBrowser, setUnsupportedBrowser] = useState(false);
  // REQUIREMENT 4: Remove ALL hardcoded placeholder caption entries completely — captions start EMPTY
  const [transcripts, setTranscripts] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [sensitivity, setSensitivity] = useState('medium');
  const [loudAlert, setLoudAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const transcriptEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const alertTimeoutRef = useRef(null);

  const isListeningRef = useRef(isListening);
  const isRecognizingRef = useRef(false);
  const lastAlertTimeRef = useRef(0);

  isListeningRef.current = isListening;

  const volumeHistoryRef = useRef([]);

  // BUG FIX: Dynamic Rolling Average & High Floor Threshold settings to prevent false ambient alerts
  const getSensitivitySettings = useCallback(() => {
    if (sensitivity === 'high') {
      return { floor: 40, multiplier: 1.8 }; // High sensitivity: 40% floor, 1.8x spike
    }
    if (sensitivity === 'low') {
      return { floor: 65, multiplier: 2.5 }; // Low sensitivity: 65% floor, 2.5x spike
    }
    return { floor: 50, multiplier: 2.0 }; // Medium sensitivity: 50% floor, 2.0x spike
  }, [sensitivity]);

  const triggerLoudSoundAlert = useCallback((title = '⚠️ Loud Sound Detected', dir = 'NEARBY') => {
    const now = Date.now();
    // REQUIREMENT 5: Cooldown intact (no repeat alert within 2.5 seconds)
    if (now - lastAlertTimeRef.current < 2500) {
      return;
    }
    lastAlertTimeRef.current = now;

    setLoudAlert(true);
    setAlertDetails({ title, dir });

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    speakText('Loud sound warning detected nearby');

    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    alertTimeoutRef.current = setTimeout(() => {
      setLoudAlert(false);
      setAlertDetails(null);
    }, 2000);
  }, [speakText]);

  const startMic = () => {
    setShowPermissionPrompt(false);
    setIsListening(true);
    speakText('Microphone permission confirmed. Listening live.');
  };

  // Web Audio API Real-Time Mic Volume Spike Analyzer with Rolling Average Buffer
  useEffect(() => {
    let stream = null;
    let isActive = true;

    const setupMicAnalyzer = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!isActive) return;
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const currentVolume = Math.min(100, Math.round((avg / 128) * 100));
          setVolumeLevel(currentVolume);

          // REQUIREMENT 3: Maintain rolling average buffer of last ~60 readings (~2-3 seconds)
          const history = volumeHistoryRef.current;
          history.push(currentVolume);
          if (history.length > 60) {
            history.shift();
          }

          // Calculate rolling average of past readings
          let rollingSum = 0;
          const historyCount = history.length - 1;
          if (historyCount > 5) {
            for (let k = 0; k < historyCount; k++) {
              rollingSum += history[k];
            }
            const rollingAvg = rollingSum / historyCount;
            const { floor, multiplier } = getSensitivitySettings();

            // REQUIREMENT 2 & 3: Only trigger alert if CURRENT reading >= floor AND >= (rollingAvg * multiplier)
            if (currentVolume >= floor && currentVolume >= (rollingAvg * multiplier)) {
              console.log(`[Saathi Loud Sound Spike Triggered] Current: ${currentVolume}%, Rolling Avg: ${rollingAvg.toFixed(1)}%, Floor: ${floor}%, Spike Ratio: ${(currentVolume / Math.max(1, rollingAvg)).toFixed(2)}x`);
              triggerLoudSoundAlert('⚠️ Loud Sound Spike Detected', 'ENVIRONMENT');
            }
          }

          animFrameRef.current = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      } catch (err) {
        console.warn('Audio analyzer mic access error:', err);
      }
    };

    if (isListening && !showPermissionPrompt) {
      setupMicAnalyzer();
    } else {
      setVolumeLevel(0);
      volumeHistoryRef.current = [];
    }

    return () => {
      isActive = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isListening, showPermissionPrompt, getSensitivitySettings, triggerLoudSoundAlert]);

  // REQUIREMENT 2 & 3 & 5: Verified SpeechRecognition onresult handler pushing to single transcripts state array
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setUnsupportedBrowser(true);
      return;
    }

    setUnsupportedBrowser(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang;

    recognition.onstart = () => {
      console.log(`[Saathi Deaf Mode] SpeechRecognition started listening in ${selectedLang}`);
      isRecognizingRef.current = true;
    };

    // REQUIREMENT 2 & 5: Direct assignment of recognition.onresult with explicit console logging
    recognition.onresult = (event) => {
      const lastIndex = event.results.length - 1;
      const latestTranscript = event.results[lastIndex]?.[0]?.transcript || '';

      // REQUIREMENT 5: Log every transcript received in browser console
      console.log('[Saathi Deaf Mode SpeechRecognition onresult fired]', {
        resultIndex: event.resultIndex,
        resultsLength: event.results.length,
        latestTranscript: latestTranscript,
        isFinal: event.results[lastIndex]?.isFinal
      });

      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const resultChunk = event.results[i];
        if (!resultChunk || !resultChunk[0]) continue;

        const transcriptChunk = resultChunk[0].transcript;

        if (resultChunk.isFinal) {
          const trimmed = transcriptChunk.trim();
          if (trimmed.length > 0) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            console.log(`[Saathi Deaf Mode FINAL TRANSCRIPT APPENDED]: "${trimmed}" at ${timeStr}`);

            // REQUIREMENT 3: Update single transcripts state array rendered in UI
            setTranscripts(prev => {
              if (prev.length > 0 && prev[prev.length - 1].text === trimmed) {
                return prev;
              }
              const updated = prev.map(item => ({ ...item, isLatest: false }));
              return [...updated, { id: Date.now() + i, text: trimmed, time: timeStr, isLatest: true }];
            });
          }
          setInterimText('');
        } else {
          currentInterim += transcriptChunk;
        }
      }

      if (currentInterim && currentInterim.trim().length > 0) {
        setInterimText(currentInterim.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      isRecognizingRef.current = false;

      if (isListeningRef.current && event.error !== 'aborted') {
        setTimeout(() => {
          if (isListeningRef.current && !isRecognizingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        }, 400);
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      if (isListeningRef.current) {
        setTimeout(() => {
          if (isListeningRef.current && !isRecognizingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        }, 400);
      }
    };

    if (isListening && !showPermissionPrompt && !isRecognizingRef.current) {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Initial recognition start error:', e);
      }
    }

    return () => {
      isRecognizingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isListening, selectedLang, showPermissionPrompt]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, interimText]);

  const handleCopyTranscript = () => {
    const fullText = transcripts.map(t => `[${t.time}] ${t.text}`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    speakText('Transcript copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const fullText = transcripts.map(t => `[${t.time}] ${t.text}`).join('\n');
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Saathi_Deaf_Mode_Transcript_${selectedLang}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    speakText('Transcript text file downloaded');
  };

  const activeLangObj = WORLD_LANGUAGES.find(l => l.code === selectedLang) || WORLD_LANGUAGES[0];

  return (
    <div 
      className="max-w-6xl mx-auto px-3 sm:px-4 pb-20 space-y-6 animate-in fade-in duration-300 relative w-full max-w-full overflow-x-hidden"
      role="main"
      aria-label="Saathi Deaf Mode Hearing Assistant Screen"
    >
      {/* Friendly Permission Modal */}
      {showPermissionPrompt && (
        <PermissionModal
          type="microphone"
          onConfirm={startMic}
          onCancel={() => onBack()}
        />
      )}

      {/* FLASHING LOUD SOUND ALERT */}
      {loudAlert && (
        <div 
          className="fixed inset-0 z-50 bg-red-600/95 flex flex-col items-center justify-center p-6 text-white text-center animate-pulse shadow-2xl"
          role="alert"
          aria-live="assertive"
        >
          <ShieldAlert className="w-20 sm:w-24 h-20 sm:h-24 mb-4 animate-bounce" />
          <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight mb-2">
            {alertDetails?.title || '⚠️ Loud Sound Detected'}
          </h2>
          <p className="text-lg sm:text-2xl font-bold text-red-100">
            Location: {alertDetails?.dir || 'ENVIRONMENT'} • High Audio Intensity
          </p>
        </div>
      )}

      {/* TOP HEADER & MULTILINGUAL SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2 border-b border-slate-800 w-full">
        <button
          onClick={() => {
            speakText('Exiting Deaf Mode');
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-medium transition-all focus:ring-2 focus:ring-emerald-400 min-h-[44px]"
          aria-label="Back to home landing page (Alt+H)"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Ear className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Suno Mere Liye</h1>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-medium">Deaf Mode • Captions & Sound Spike Radar</p>
          </div>
        </div>

        {/* SHARED WORLD LANGUAGES DROPDOWN */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 w-full sm:w-auto justify-between sm:justify-start min-h-[44px]">
          <Languages className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-xs text-slate-400 font-semibold">Language:</span>
          <select
            value={selectedLang}
            onChange={(e) => {
              const newLang = e.target.value;
              setSelectedLang(newLang);
              const langObj = WORLD_LANGUAGES.find(l => l.code === newLang);
              speakText(`Language changed to ${langObj?.name || newLang}`);
            }}
            className="bg-slate-950 border border-slate-800 text-emerald-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[36px]"
            aria-label="Select speech transcription language"
          >
            {WORLD_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* UNSUPPORTED BROWSER WARNING UI */}
      {unsupportedBrowser && (
        <div className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 text-amber-200 flex items-center gap-3">
          <Chrome className="w-7 h-7 text-amber-400 flex-shrink-0 animate-bounce" />
          <div>
            <h3 className="font-bold text-sm text-amber-300">Browser Speech Recognition Required</h3>
            <p className="text-xs text-amber-200">
              Please open Saathi in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> for live speech-to-text.
            </p>
          </div>
        </div>
      )}

      {/* ACTION CONTROLS & SETTINGS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 w-full">
        <button
          onClick={() => {
            const nextVal = !isListening;
            setIsListening(nextVal);
            speakText(nextVal ? 'Live captions listening resumed.' : 'Live captions paused.');
          }}
          className={`flex items-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition-all border shadow-lg focus:ring-4 focus:ring-emerald-300 min-h-[48px] w-full sm:w-auto justify-center ${
            isListening
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 hover:bg-emerald-400'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
          }`}
          aria-label={isListening ? "Pause microphone speech transcription" : "Resume microphone speech transcription"}
        >
          {isListening ? (
            <>
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-slate-950"></span>
              </span>
              <span>Listening Live ({activeLangObj.name})...</span>
            </>
          ) : (
            <>
              <MicOff className="w-5 h-5" />
              <span>Start Listening</span>
            </>
          )}
        </button>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 min-h-[44px]">
            <Settings className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Spike Sensitivity:</span>
            <select
              value={sensitivity}
              onChange={(e) => {
                setSensitivity(e.target.value);
                speakText(`Sound spike sensitivity set to ${e.target.value}`);
              }}
              className="bg-slate-950 border border-slate-800 text-emerald-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 font-bold"
              aria-label="Sound spike detection sensitivity"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={handleCopyTranscript}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all focus:ring-2 focus:ring-emerald-400 min-h-[44px]"
            aria-label="Copy transcript text to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all focus:ring-2 focus:ring-emerald-400 min-h-[44px]"
            aria-label="Save transcript as text file"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* MAIN CAPTIONS DISPLAY CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="lg:col-span-8 space-y-4">
          <div 
            tabIndex={0}
            role="region"
            aria-label="Real-time speech transcriptions container"
            className="glass-panel rounded-3xl p-4 sm:p-6 border-2 border-emerald-500/40 shadow-2xl h-[480px] sm:h-[520px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-400">
              <span>Real-Time Captions ({activeLangObj.name})</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Mic: {volumeLevel}%
              </span>
            </div>

            <div 
              aria-live="polite"
              aria-relevant="additions text"
              className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 scrollbar-thin"
            >
              {transcripts.length === 0 && !interimText && (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 space-y-3">
                  <Mic className="w-12 h-12 text-emerald-400/40 animate-pulse" />
                  <p className="text-base sm:text-lg font-bold text-slate-200">Listening for spoken words...</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Speak out loud in {activeLangObj.name}. Live transcribed captions will appear here automatically.
                  </p>
                </div>
              )}

              {transcripts.map((t) => (
                <div
                  key={t.id}
                  className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                    t.isLatest
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-1">
                    <span className={`font-bold ${t.isLatest ? 'text-emerald-300 text-xs sm:text-sm' : 'text-slate-400'}`}>
                      {t.isLatest ? '👉 LATEST SPEECH SENTENCE' : 'Speaker'}
                    </span>
                    <span>{t.time}</span>
                  </div>

                  <p className={`leading-relaxed break-words ${t.isLatest ? 'text-xl sm:text-3xl font-black text-emerald-200' : 'text-base sm:text-lg font-medium text-slate-200'}`}>
                    {t.text}
                  </p>
                </div>
              ))}

              {interimText && (
                <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/60 text-cyan-200 text-lg sm:text-xl font-bold animate-pulse break-words">
                  <span className="text-[10px] text-cyan-400 font-bold block mb-1">Transcribing Live...</span>
                  {interimText}...
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] sm:text-xs text-slate-400 flex items-center justify-between">
              <span>Auto-restart enabled for continuous conversation stability.</span>
              <span className="text-emerald-400 font-bold">Auto-scrolling Active</span>
            </div>
          </div>
        </div>

        {/* Right Cols: Sound Event Simulators */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Test Sound Spike Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Tap any sound trigger to test full-screen visual alerts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {SOUND_SIMULATIONS.map((snd) => (
                <button
                  key={snd.id}
                  onClick={() => triggerLoudSoundAlert(`⚠️ ${snd.name} Detected`, snd.dir)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] focus:ring-2 focus:ring-emerald-400 min-h-[48px] ${snd.color}`}
                  aria-label={`Simulate ${snd.name} sound spike alert`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm sm:text-base">{snd.name}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-black/40 border border-white/20">
                      {snd.level}
                    </span>
                  </div>
                  <span className="text-[11px] opacity-80 block mt-0.5">Direction: {snd.dir}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
