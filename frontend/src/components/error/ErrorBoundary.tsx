// frontend/src/components/error/ErrorBoundary.tsx
import React, { type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  // This lifecycle is called after an error has been thrown by a descendant component.
  // It receives the error that was thrown as a parameter.
  // It should return a value to update state.
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // This lifecycle is called after an error has been thrown by a descendant component.
  // It receives two parameters: the error that was thrown and an object with information about which component threw the error.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // TODO: Integrate with an error logging service like Sentry or LogRocket
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
            <p className="text-lg mb-6">
              We're sorry, but an unexpected error occurred. Please try refreshing the page or
              contact support if the issue persists.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-50 p-4 rounded-md border border-gray-200">
                <summary className="font-semibold cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  <br />
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
