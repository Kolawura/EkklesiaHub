"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        {/* Animated Loader */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
            {/* Inner ring */}
            <div
              className="absolute inset-2 border-2 border-transparent border-b-primary/50 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-foreground">Loading</h2>
          <p className="text-foreground/60 font-light">
            Please wait while we prepare everything for you.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                width: "30%",
              }}
            />
          </div>
          <p className="text-xs text-foreground/40 font-light">
            This may take a moment
          </p>
        </div>
      </div>
    </div>
  );
}
