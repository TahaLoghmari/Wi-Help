import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useAppNavigation } from "@/hooks";
import { env } from "@/config";

export const MainErrorFallback = ({ error, reset }: ErrorComponentProps) => {
  const { goToHome } = useAppNavigation();
  const isDev = env.isDevelopment;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl border-red-200">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            An unexpected error occurred. Please try refreshing the page or
            return to the home page.
          </CardDescription>
        </CardHeader>

        {isDev && error && (
          <div className="px-6 pb-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-sm font-semibold text-red-800">
                Error Details (Development Only):
              </p>
              <pre className="max-h-64 overflow-auto text-xs wrap-break-word whitespace-pre-wrap text-red-700">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </div>
          </div>
        )}

        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={goToHome}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
