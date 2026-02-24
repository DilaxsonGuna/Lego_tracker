"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  message?: string;
}

export function ErrorFallback({
  error,
  reset,
  message = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">{message}</h2>
        {error?.message && (
          <p className="max-w-md text-sm text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>
      {reset && (
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
