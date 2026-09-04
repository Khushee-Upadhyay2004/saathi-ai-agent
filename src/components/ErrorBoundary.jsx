import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Saathi Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-3xl bg-red-950/80 border-2 border-red-500/50 max-w-md space-y-4 shadow-2xl">
            <AlertOctagon className="w-16 h-16 text-red-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-slate-100">Something Went Wrong</h2>
            <p className="text-slate-300 text-sm">
              Saathi encountered an unexpected issue. Please click below to restart the application safely.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-base transition-all focus:ring-4 focus:ring-red-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reload Saathi Companion</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
