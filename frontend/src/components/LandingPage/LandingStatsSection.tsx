import React from "react";

export const LandingStatsSection = () => {
  return (
    <section className="py-16 px-6 border-y border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text mb-2">
            50K+
          </div>
          <p className="text-muted-foreground">Active Writers</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text mb-2">
            2M+
          </div>
          <p className="text-muted-foreground">Stories Published</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text mb-2">
            500K+
          </div>
          <p className="text-muted-foreground">Active Communities</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text mb-2">
            10M+
          </div>
          <p className="text-muted-foreground">Monthly Readers</p>
        </div>
      </div>
    </section>
  );
};
