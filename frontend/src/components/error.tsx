"use client";
import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

const createRetryHandler =
  (reset: () => void, setIsLoading: (value: boolean) => void) => () => {
    setIsLoading(true);

    // Execute reset synchronously to retry the operation that caused the error
    // The reset() function from Next.js error boundary re-renders and re-executes the failed component
    try {
      reset();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      // Keep loading state for user feedback, then clear it
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(error);
  }, [error]);

  // Functional retry handler
  const handleRetry = createRetryHandler(reset, setIsLoading);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-pattern"></div>

      <div className="relative max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Error Icon with pulse animation */}
        <div className="flex justify-center relative">
          <div className="absolute w-32 h-32 rounded-full bg-red-500/20 dark:bg-red-400/10 animate-pulse-slow blur-xl"></div>
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-full shadow-2xl shadow-red-500/20 dark:shadow-red-400/10 ring-8 ring-red-500/10 dark:ring-red-400/5 animate-float">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-sm mx-auto">
            We encountered an unexpected error. Our team has been notified and
            we&apos;re working to fix it.
          </p>
        </div>

        {/* Error Details */}
        {error.message && (
          <div className="p-4 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-900/50 shadow-lg">
            <p className="text-sm text-red-800 dark:text-red-300 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleRetry}
            disabled={isLoading}
            aria-busy={isLoading}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black rounded-full font-medium shadow-xl shadow-gray-900/20 dark:shadow-white/20 hover:shadow-2xl hover:shadow-gray-900/30 dark:hover:shadow-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <RefreshCw
              className={`relative w-5 h-5 transition-transform duration-300 ${
                isLoading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span className="relative">
              {isLoading ? "Retrying..." : "Try Again"}
            </span>
          </button>

          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-full font-medium border-2 border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Go Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-600 font-light tracking-wider uppercase">
            Error ID:{" "}
            <span className="font-mono text-gray-600 dark:text-gray-500">
              {error.digest || "unknown"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
