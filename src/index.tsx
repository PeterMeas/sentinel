import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 font-mono text-red-600 bg-white h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">System Malfunction</h1>
          <div className="bg-gray-100 p-6 rounded border border-gray-200 max-w-2xl w-full overflow-auto text-left">
            <p className="mb-2 text-xs font-bold text-gray-500 uppercase">Error Log:</p>
            <pre className="text-sm whitespace-pre-wrap">
              {this.state.error?.toString() || "Unknown Fatal Error"}
            </pre>
          </div>
          <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">Please reload the terminal.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);