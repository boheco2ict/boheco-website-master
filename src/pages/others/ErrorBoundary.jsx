import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-600">The app encountered an unexpected error.</p>
          <details className="mt-4 whitespace-pre-wrap text-xs text-slate-700">
            {this.state.error && this.state.error.toString()}
            {this.state.info && this.state.info.componentStack}
          </details>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-slate-900 px-4 py-2 text-white"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
