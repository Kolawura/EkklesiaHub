"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-foreground text-balance">
            Something went wrong
          </h1>
          <p className="text-foreground/60 font-light leading-relaxed">
            We encountered an unexpected error. Our team has been notified and
            we&apos;re working to fix it.
          </p>
        </div>

        {/* Error Details (Optional) */}
        {error.message && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-foreground/50 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted/50 transition-colors font-medium"
          >
            Go back
          </Link>
        </div>

        {/* Support Info */}
        <p className="text-xs text-foreground/40 font-light">
          Error ID: {error.digest || "unknown"}
        </p>
      </div>
    </div>
  );
}
