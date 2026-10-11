/**
 * ErrorBoundary — Gift with Love design system.
 *
 * Catches React rendering errors and displays a branded fallback UI
 * instead of crashing the entire application (fixes C4 from the audit).
 *
 * Usage (wrap any subtree):
 *   <ErrorBoundary>
 *     <ComponentThatMightThrow />
 *   </ErrorBoundary>
 *
 * For section-level isolation, use the `label` prop:
 *   <ErrorBoundary label="Dashboard">
 *     <Dashboard />
 *   </ErrorBoundary>
 */
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, this is where you'd send to an error reporting service.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const label = this.props.label ?? "this section";

    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <p className="text-3xl mb-3" aria-hidden="true">🌹</p>
        <h2 className="font-serif text-xl font-semibold text-burgundy-700 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-neutral-500 max-w-xs mb-6">
          {`We couldn't load ${label}. Please refresh the page or try again shortly.`}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          className="text-sm font-semibold text-burgundy-600 border border-burgundy-200
            px-5 py-2.5 rounded-md hover:bg-burgundy-50 transition-colors
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-burgundy-500 focus-visible:ring-offset-2"
        >
          Try again
        </button>
        {import.meta.env.DEV && this.state.error && (
          <details className="mt-6 text-left max-w-md">
            <summary className="text-xs text-neutral-400 cursor-pointer">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs text-rose-600 bg-rose-50 rounded p-3 overflow-auto">
              {this.state.error.message}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
