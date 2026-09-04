import React from 'react';
import { Camera, Mic, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PermissionModal({ type, onConfirm, onCancel }) {
  const isCamera = type === 'camera';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="permission-modal-title"
      aria-modal="true"
    >
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-cyan-400/80 shadow-2xl space-y-6 relative">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            {isCamera ? <Camera className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </div>
          <div>
            <h3 id="permission-modal-title" className="text-xl font-bold text-slate-100">
              {isCamera ? 'Camera Access Needed' : 'Microphone Access Needed'}
            </h3>
            <span className="text-xs text-cyan-400 font-semibold">Privacy First • On-Device Streaming</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {isCamera
            ? 'Saathi needs camera access to scan your surroundings, read currency notes, and describe obstacles in real time.'
            : 'Saathi needs microphone access to transcribe live speech captions and detect loud sound warning alerts.'}
        </p>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe & Secure:
          </div>
          <p>Your video/audio streams are processed live for accessibility and are never saved or shared.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-base shadow-lg transition-all focus:ring-4 focus:ring-cyan-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Allow Permission</span>
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
