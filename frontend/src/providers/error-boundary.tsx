import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorComponent } from "@/components";
import { logger } from "@/lib";

interface ErrorBoundaryProps {
  children: ReactNode;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    logger.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, showDetails } = this.props;
    if (hasError) {
      const message =
        showDetails && error
          ? error.message
          : "An unexpected error occurred. Please try again later.";

      return (
        <div className="flex w-full flex-col items-center gap-4 p-6">
          <ErrorComponent title="Unexpected error" message={message} />
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={this.resetError}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}
