import React from 'react';
import { X, Keyboard, Eye, Ear, Mic, Home, Volume2, Sun, Sparkles } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose, speakText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="glass-panel w-full max-w-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-labelledby="shortcuts-title"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Close keyboard shortcuts modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-all focus:ring-2 focus:ring-cyan-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 id="shortcuts-title" className="text-xl font-bold text-slate-100">
              Keyboard Shortcuts Guide
            </h2>
            <p className="text-sm text-slate-400">
              Designed for screen readers & rapid accessibility navigation
            </p>
          </div>
        </div>

        <div className="space-y-3 my-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Home className="w-4 h-4 text-cyan-400" /> Go to Home Landing Page
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono text-sm border border-slate-700">Alt + H</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Eye className="w-4 h-4 text-amber-400" /> Open "Dekho Mere Liye" (Blind Vision AI)
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono text-sm border border-slate-700">Alt + V</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Ear className="w-4 h-4 text-emerald-400" /> Open "Suno Mere Liye" (Deaf Hearing AI)
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-emerald-300 font-mono text-sm border border-slate-700">Alt + A</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Mic className="w-4 h-4 text-purple-400" /> Open "Bolo Mere Liye" (Mute Speech AI)
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 font-mono text-sm border border-slate-700">Alt + B</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Sun className="w-4 h-4 text-purple-400" /> Toggle High Contrast Theme
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 font-mono text-sm border border-slate-700">Alt + C</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 font-medium">
              <Volume2 className="w-4 h-4 text-blue-400" /> Toggle Voice Narrator
            </span>
            <kbd className="px-2.5 py-1 rounded bg-slate-800 text-blue-300 font-mono text-sm border border-slate-700">Alt + S</kbd>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-center transition-all focus:ring-2 focus:ring-cyan-300"
        >
          Got it, Close Guide
        </button>
      </div>
    </div>
  );
}
