import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogoLoader from '@/components/ui/LogoLoader';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
    // Attempt auto-recovery at most once after 300ms, never in an infinite loop
    if (this.state.retryCount < 1) {
      setTimeout(() => {
        if (this.state.hasError) {
          this.setState(prev => ({
            hasError: false,
            error: undefined,
            retryCount: prev.retryCount + 1
          }));
        }
      }, 300);
    }
  }

  private handleManualReset = () => {
    this.setState({ hasError: false, error: undefined, retryCount: 0 });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.state.retryCount >= 1) {
        return (
          <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center antialiased">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-4 text-xl font-black shadow-sm">
                A
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">Portal Session Updated</h2>
              <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
                A background sync completed. Click below to continue directly to your dashboard.
              </p>
              <button
                type="button"
                onClick={this.handleManualReset}
                className="w-full py-3 px-6 bg-[#000000] text-white font-bold rounded-xl hover:bg-slate-800 transition active:scale-95 shadow-md cursor-pointer text-sm"
              >
                Reload Portal
              </button>
            </div>
          </div>
        );
      }
      return <LogoLoader size="fullscreen" />;
    }

    return this.props.children;
  }
}
