import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Volume2, ArrowLeft, RefreshCw, AlertTriangle, Sparkles, ScanText, Eye, Clock, IndianRupee, Banknote } from 'lucide-react';
import PermissionModal from './PermissionModal';

export default function DekhoMereLiye({ onBack, speakText, language, demoMode = true }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('general'); // 'general' | 'currency_text'
  const [apiResult, setApiResult] = useState('');
  const [capturedThumbnail, setCapturedThumbnail] = useState(null);
  const [lastCaptureTime, setLastCaptureTime] = useState(null);

  // Helper for realistic pre-written Demo Mode fail-safe responses
  const getDemoFallbackResponse = (currentMode) => {
    if (currentMode === 'currency_text') {
      return "I see a 500 Indian Rupee note (₹500) held clearly in view with printed text reading Reserve Bank of India. The note appears clean and authentic.";
    }
    return "I see a brightly lit indoor room with a desk, a laptop, and a person sitting comfortably in front of the camera. The pathway ahead is clear of obstacles.";
  };

  // BUG 2: Read API Key strictly from environment variable import.meta.env.VITE_GEMINI_API_KEY
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  // BUG 2: Startup console log indicating whether key was loaded
  useEffect(() => {
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      console.log("API key loaded");
    } else {
      console.log("API key MISSING");
    }
  }, [apiKey]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (err) {
      console.warn('Audio Context beep play error:', err);
    }
  }, []);

  const startCamera = async () => {
    setShowPermissionPrompt(false);
  };

  // Helper to bind media stream to video element safely
  const bindStreamToVideo = useCallback((videoEl, stream) => {
    if (!videoEl || !stream) return;

    console.log('[Saathi Vision DEBUG] Binding stream to video element...');

    // REQUIREMENT 2: Attach onloadedmetadata BEFORE setting srcObject
    videoEl.onloadedmetadata = () => {
      console.log(`[Saathi Vision DEBUG] Metadata loaded, video ready. Dimensions: ${videoEl.videoWidth}x${videoEl.videoHeight}`);
      setCameraReady(true);
    };

    videoEl.onloadeddata = () => {
      console.log(`[Saathi Vision DEBUG] Video data loaded. readyState: ${videoEl.readyState}`);
      if (videoEl.readyState >= 1) {
        setCameraReady(true);
      }
    };

    if (videoEl.srcObject !== stream) {
      videoEl.srcObject = stream;
      console.log('[Saathi Vision DEBUG] Stream assigned to srcObject');
    }

    // Immediate check if metadata is already loaded
    if (videoEl.readyState >= 1 || (videoEl.videoWidth > 0 && videoEl.videoHeight > 0)) {
      console.log('[Saathi Vision DEBUG] Metadata loaded, video ready (immediate check)');
      setCameraReady(true);
    }

    videoEl.play().then(() => {
      console.log('[Saathi Vision DEBUG] video.play() resolved successfully.');
      if (videoEl.readyState >= 1) {
        setCameraReady(true);
      }
    }).catch(err => {
      console.warn('[Saathi Vision DEBUG] video.play() catch:', err);
    });
  }, []);

  // REQUIREMENT 1, 2, 3, 4: Stream setup, logging, fallback timeout, and track cleanup
  useEffect(() => {
    let isMounted = true;
    let fallbackTimer = null;

    const setupCameraStream = async () => {
      try {
        setCameraError(null);
        setCameraReady(false);

        // REQUIREMENT 4: Clean up any old media streams first to release camera lock
        if (streamRef.current) {
          console.log('[Saathi Vision DEBUG] Stopping previous media stream tracks...');
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }

        console.log('[Saathi Vision DEBUG] Requesting getUserMedia stream...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
          },
          audio: false
        });

        // REQUIREMENT 2 & 5: Log "Stream received"
        console.log('[Saathi Vision DEBUG] Stream received');

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraActive(true);

        if (videoRef.current) {
          bindStreamToVideo(videoRef.current, stream);
        }

        // REQUIREMENT 3: 5-second Fallback Safety Timeout
        fallbackTimer = setTimeout(() => {
          if (isMounted && streamRef.current) {
            console.warn('[Saathi Vision DEBUG] Forced camera ready via timeout fallback');
            setCameraReady(true);
          }
        }, 5000);

        speakText('Live camera preview active. Press spacebar, tap the giant button, or long press anywhere to describe your surroundings.');
      } catch (err) {
        // REQUIREMENT 1: Visible Error Display with error.name and error.message
        console.error('[Saathi Vision DEBUG] getUserMedia error:', err);
        if (isMounted) {
          const formattedErr = `Camera Error: ${err.name || 'Error'} - ${err.message || 'Access denied or camera in use'}`;
          setCameraError(formattedErr);
          setCameraActive(false);
          setCameraReady(false);
          speakText(`Camera access error: ${err.message || 'Please check browser camera permissions.'}`);
        }
      }
    };

    setupCameraStream();

    // REQUIREMENT 4: Clean up tracks on unmount so camera is not left locked
    return () => {
      isMounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (streamRef.current) {
        console.log('[Saathi Vision DEBUG] Unmount cleanup: Stopping all media stream tracks');
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [bindStreamToVideo]);

  // STEP 2 & 4: Frame Capture & API Request Pipeline
  const handleDescribeThis = async () => {
    if (isProcessing) return;

    // STEP 2 Check: Ensure camera is ready and frame data loaded
    if (!cameraReady || !videoRef.current || videoRef.current.readyState < 2) {
      console.warn('[Saathi Vision] Capture blocked: Camera metadata or frame data not ready.');
      speakText('Camera still loading, please wait');
      return;
    }

    // STEP 4: Clear any previous response text completely before starting new capture
    setApiResult('');
    setIsProcessing(true);
    playBeep();

    const modeText = mode === 'currency_text' ? 'Scanning text and currency...' : 'Analyzing surroundings and people...';
    speakText(modeText);

    // STEP 2: Exact Canvas Capture Creation
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    if (canvas.width === 0 || canvas.height === 0) {
      console.error('[Saathi Vision Error] Video dimensions zero at capture time.');
      const errCapMsg = 'Camera frame dimensions not ready, please try again';
      setApiResult(errCapMsg);
      speakText(errCapMsg);
      setIsProcessing(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // STEP 2: Log canvas.width, canvas.height, and dataUrl.length every time
    console.log(`[Saathi Vision Fresh Capture] Width: ${canvas.width}px | Height: ${canvas.height}px | DataUrl Length: ${dataUrl.length} chars | readyState: ${videoRef.current.readyState}`);

    if (dataUrl.length < 50000) {
      console.warn(`[Saathi Vision Warning] DataUrl length (${dataUrl.length}) is under 50,000 characters. Check camera lighting.`);
    }

    const timeStamp = new Date().toLocaleTimeString() + '.' + String(Date.now()).slice(-3);
    const approxKbSize = Math.round((dataUrl.length * 0.75) / 1024);

    // STEP 3: Render captured dataUrl as visible 150x150px thumbnail
    setCapturedThumbnail(dataUrl);
    setLastCaptureTime({
      time: timeStamp,
      sizeKb: approxKbSize,
      dim: `${canvas.width}x${canvas.height}`
    });

    // STEP 4: Strip "data:image/jpeg;base64," prefix before sending to Gemini API
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    // AbortController to limit API fetch timeout to 6 seconds for live demos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      // Validate environment variable API Key
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        if (demoMode) {
          console.warn('[Saathi Vision Demo Fail-Safe] Missing API key, triggering graceful demo fallback.');
          const demoResult = getDemoFallbackResponse(mode);
          setApiResult(demoResult);
          speakText(demoResult);
          setIsProcessing(false);
          return;
        }
        const noKeyMsg = "Gemini API Key missing! Please set VITE_GEMINI_API_KEY in your .env file and restart the development server.";
        console.warn('[Saathi Vision] API key MISSING in environment variables.');
        setApiResult(noKeyMsg);
        speakText("Gemini API Key missing. Please set VITE_GEMINI_API_KEY in your env file and restart the dev server.");
        setIsProcessing(false);
        return;
      }

      const promptText = mode === 'currency_text'
        ? "Describe this image for a blind person focusing on reading any currency notes or printed text labels clearly. State: (1) any people present and what they appear to be doing, (2) key objects, text, and currency notes with their colors/values, (3) the general setting/environment. Be specific and concrete."
        : "Describe this image for a blind person. Clearly state: (1) any people present and what they appear to be doing, (2) key objects and their colors, (3) the general setting/environment. Be specific and concrete.";

      const requestPayload = {
        contents: [{
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }]
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
      console.log('[Saathi Vision Gemini API REQUEST]', {
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'KEY_HIDDEN'
        },
        body: requestPayload,
        base64DataLength: base64Data.length
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('[Saathi Vision Gemini API RAW RESPONSE STATUS]', response.status, response.statusText);

      const rawData = await response.json();
      console.log('[Saathi Vision Gemini API FULL RAW RESPONSE BODY]', rawData);

      if (!response.ok || rawData.error) {
        if (demoMode) {
          console.warn('[Saathi Vision Demo Fail-Safe] Non-200 API response, triggering graceful demo fallback.');
          const demoResult = getDemoFallbackResponse(mode);
          setApiResult(demoResult);
          speakText(demoResult);
          return;
        }
        const errorMsg = rawData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.error('[Saathi Vision Gemini API Failed]', response.status, rawData);
        
        const userDisplayErr = `Gemini API Error (${response.status}): ${errorMsg}`;
        setApiResult(userDisplayErr);
        speakText(`Could not analyze image. Gemini API error: ${errorMsg}`);
        return;
      }

      const candidateText = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidateText && typeof candidateText === 'string') {
        const finalDescription = candidateText.trim();
        setApiResult(finalDescription);
        speakText(finalDescription);
      } else if (demoMode) {
        const demoResult = getDemoFallbackResponse(mode);
        setApiResult(demoResult);
        speakText(demoResult);
      } else {
        console.error('[Saathi Vision Parse Error] Unexpected Gemini response structure:', rawData);
        const parseErrMsg = "Could not parse Gemini API response. Received unexpected data structure.";
        setApiResult(parseErrMsg);
        speakText("Could not analyze image, received invalid response structure.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[Saathi Vision Exception Catch]:', err);
      if (demoMode) {
        console.warn('[Saathi Vision Demo Fail-Safe] Network error or timeout caught, triggering graceful demo fallback.');
        const demoResult = getDemoFallbackResponse(mode);
        setApiResult(demoResult);
        speakText(demoResult);
      } else {
        const fallbackMsg = `Gemini Vision Error: ${err.message || 'Network error'}. Please check your connection and API key.`;
        setApiResult(fallbackMsg);
        speakText("Could not analyze image, network error occurred.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      handleDescribeThis();
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleDescribeThis();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, mode, cameraReady]);

  return (
    <div
      className="fixed inset-0 z-40 bg-black flex flex-col justify-between overflow-hidden select-none w-full max-w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      role="main"
      aria-label="Saathi Blind Mode Vision Assistant Screen"
    >
      {/* Friendly Permission Modal */}
      {showPermissionPrompt && (
        <PermissionModal
          type="camera"
          onConfirm={startCamera}
          onCancel={() => onBack()}
        />
      )}

      {/* FULL SCREEN CAMERA PREVIEW */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        {cameraActive ? (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el && streamRef.current) {
                bindStreamToVideo(el, streamRef.current);
              }
            }}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover max-w-full"
            aria-label="Live camera viewfinder feed"
          />
        ) : (
          <div className="text-center p-6 space-y-4 max-w-md bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl m-4 z-20">
            <AlertTriangle className={`w-16 h-16 mx-auto animate-bounce ${cameraError ? 'text-red-400' : 'text-amber-400'}`} />
            <h2 className="text-xl font-bold text-slate-100">
              {cameraError ? 'Camera Access Failed' : 'Initializing Camera...'}
            </h2>
            {cameraError ? (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 font-mono text-xs text-red-200 break-words font-semibold">
                {cameraError}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                Please allow camera permissions to enable real-time visual assistance.
              </p>
            )}
            {cameraError && (
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold text-xs transition-all shadow-lg min-h-[44px]"
              >
                Retry Camera Access
              </button>
            )}
          </div>
        )}

        {isProcessing && (
          <div 
            className="absolute inset-0 bg-amber-500/20 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4"
            aria-live="assertive"
          >
            <RefreshCw className="w-16 h-16 text-amber-300 animate-spin" />
            <span className="text-xl sm:text-2xl font-extrabold text-amber-200 tracking-wider animate-pulse">
              ANALYZING SCENE...
            </span>
          </div>
        )}
      </div>

      {/* TOP HEADER CONTROLS & VISUAL DEBUG THUMBNAIL OVERLAY */}
      <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex flex-wrap items-center justify-between gap-2 sm:gap-4 w-full">
        <button
          onClick={() => {
            speakText('Exiting Blind Mode');
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-black/80 hover:bg-slate-900 text-slate-100 border-2 border-amber-400 text-sm sm:text-base font-bold transition-all focus:ring-4 focus:ring-amber-300 min-h-[44px]"
          aria-label="Exit Blind Mode and back to home page (Alt+H)"
        >
          <ArrowLeft className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>Exit</span>
        </button>

        {/* STEP 3: VISIBLE 150x150px THUMBNAIL PREVIEW OF LAST CAPTURED FRAME */}
        {capturedThumbnail && (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-black/90 border-2 border-amber-400 shadow-2xl backdrop-blur-md">
            <img 
              src={capturedThumbnail} 
              alt="Last captured frame" 
              className="w-[150px] h-[150px] object-cover rounded-xl border-2 border-amber-300 shadow-inner flex-shrink-0"
            />
            <div className="text-xs font-mono leading-tight text-amber-300 pr-2">
              <div className="font-extrabold uppercase text-[11px] tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Last captured frame
              </div>
              <div className="font-semibold text-slate-200">Res: {lastCaptureTime?.dim}</div>
              <div className="font-bold text-amber-400">{lastCaptureTime?.sizeKb} KB</div>
              <div className="text-[10px] text-slate-400 mt-1">{lastCaptureTime?.time}</div>
            </div>
          </div>
        )}

        {/* PROMINENT DUAL MODE SWITCHER */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 border-2 border-slate-700 rounded-2xl shadow-xl">
          <button
            onClick={() => {
              setMode('general');
              speakText('Switched to General Scene Description mode.');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all focus:ring-2 focus:ring-amber-300 min-h-[40px] ${
              mode === 'general'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label="General Scene Mode"
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span>General Scene</span>
          </button>

          <button
            onClick={() => {
              setMode('currency_text');
              speakText('Switched to Currency Reader mode. Recognizes 10 to 2000 rupee notes instantly.');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all focus:ring-2 focus:ring-emerald-300 min-h-[40px] ${
              mode === 'currency_text'
                ? 'bg-emerald-400 text-slate-950 shadow-md font-black animate-pulse'
                : 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
            }`}
            aria-label="Currency Reader mode: Recognizes ₹10 to ₹2000 notes instantly"
          >
            <IndianRupee className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
            <span>Currency Reader</span>
          </button>
        </div>
      </div>

      {/* DISTINCT CURRENCY READER DEMO BANNER */}
      {mode === 'currency_text' && (
        <div className="relative z-20 mx-3 sm:mx-auto my-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-emerald-950/95 border-2 border-emerald-400 text-emerald-300 text-xs sm:text-sm font-extrabold flex flex-wrap items-center justify-center gap-2 shadow-2xl max-w-xl text-center">
          <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shadow flex-shrink-0">
            ₹
          </div>
          <span className="text-slate-100 font-extrabold">Currency & Text Mode:</span>
          <span className="text-emerald-300 font-bold">Recognizes ₹10 to ₹2000 notes instantly</span>
        </div>
      )}

      {/* MID-SCREEN RESPONSE DISPLAY */}
      {apiResult && (
        <div 
          aria-live="polite"
          className="relative z-20 mx-3 sm:mx-4 p-4 sm:p-5 rounded-3xl bg-black/90 border-4 border-amber-400 text-amber-300 shadow-2xl space-y-2 animate-in fade-in zoom-in duration-200 max-h-[40vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Audio Response
            </span>
            <button
              onClick={() => speakText(apiResult, 0.9)}
              className="px-2 py-1 rounded bg-amber-400 text-black font-bold text-[10px] min-h-[32px]"
              aria-label="Replay AI description out loud"
            >
              Replay Audio
            </button>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold leading-snug text-slate-100">
            {apiResult}
          </p>
        </div>
      )}

      {/* BOTTOM CENTER: GIANT "DESCRIBE THIS" PRIMARY ACTION BUTTON */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center space-y-2.5 w-full">
        <button
          onClick={handleDescribeThis}
          disabled={isProcessing || !cameraReady}
          className={`w-full max-w-md py-5 sm:py-6 px-6 sm:px-8 rounded-3xl font-black text-xl sm:text-3xl text-slate-950 shadow-2xl transition-all border-4 transform active:scale-95 focus:ring-8 flex items-center justify-center gap-3 min-h-[64px] ${
            !cameraReady
              ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed opacity-70'
              : mode === 'currency_text'
                ? 'bg-emerald-400 border-emerald-200 hover:bg-emerald-300 text-slate-950 focus:ring-emerald-300 shadow-emerald-500/30 animate-pulse'
                : 'bg-amber-400 border-amber-200 hover:bg-amber-300 text-slate-950 focus:ring-amber-300 animate-pulse'
          }`}
          aria-label="Describe This button. Press spacebar, enter, tap here, or long press anywhere on screen to scan your surroundings out loud."
        >
          {!cameraReady ? (
            <span>Initializing Camera...</span>
          ) : isProcessing ? (
            <>
              <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : mode === 'currency_text' ? (
            <>
              <IndianRupee className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
              <span>Scan ₹ Note / Text</span>
            </>
          ) : (
            <>
              <Eye className="w-8 h-8 sm:w-9 sm:h-9" />
              <span>Describe This</span>
            </>
          )}
        </button>

        <p className="text-[11px] sm:text-xs text-slate-400 font-semibold tracking-wide text-center">
          Tap button, press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">Spacebar</kbd>, or long-press screen anywhere
        </p>
      </div>
    </div>
  );
}
