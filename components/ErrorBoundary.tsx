import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * App-level error boundary so an unexpected render error shows a branded fallback
 * (with a reload) instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#0A0F18] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FACC15] to-[#F59E0B] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Something went sideways
          </h1>
          <p className="text-white/60 mb-6">
            We hit an unexpected error. Reloading usually clears it up.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-[#FACC15] text-black font-semibold rounded-xl hover:bg-[#F59E0B] transition-colors"
          >
            Reload Fasterclass
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
