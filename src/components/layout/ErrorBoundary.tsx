import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogoLoader from '@/components/ui/LogoLoader';

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
    console.warn('[ErrorBoundary auto-recovery]', error, errorInfo);
    // Smooth auto-recovery: clear error state after brief logo pulse
    setTimeout(() => {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: undefined });
      }
    }, 1200);
  }

  public render() {
    if (this.state.hasError) {
      // Quiet logo loader without any disruptive "Something went wrong" popup
      return <LogoLoader size="fullscreen" />;
    }

    return this.props.children;
  }
}
