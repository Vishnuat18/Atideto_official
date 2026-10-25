import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c0f18] border border-white/10 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/15 text-[#38BDF8] border border-[#0066FF]/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="size-7" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight mb-2 font-heading">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              We encountered an unexpected rendering error. Please refresh the page to continue.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0042D0] hover:to-[#005AEB] shadow-[0_4px_16px_rgba(0,102,255,0.4)] border border-[#38BDF8]/30 transition-all cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
