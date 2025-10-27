"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        {/* Error Code */}
        <div className="space-y-2">
          <div className="text-7xl font-light text-foreground/40">404</div>
          <h1 className="text-4xl font-light text-foreground text-balance">
            Page not found
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg text-foreground/60 font-light leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted/50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="pt-8 opacity-20">
          <div className="w-24 h-24 mx-auto border border-border rounded-full" />
        </div>
      </div>
    </div>
  );
}
