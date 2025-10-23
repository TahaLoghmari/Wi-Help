import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useAppNavigation } from "@/hooks";
import { env } from "@/config/env";

export const MainErrorFallback = ({ error, reset }: ErrorComponentProps) => {
  const { goToHome } = useAppNavigation();
  const isDev = env.isDevelopment;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
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
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-semibold text-red-800 mb-2">
                Error Details (Development Only):
              </p>
              <pre className="text-xs text-red-700 overflow-auto max-h-64 whitespace-pre-wrap wrap-break-word">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </div>
          </div>
        )}

        <CardFooter className="flex gap-2 justify-center">
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
