import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export const LandingHeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 rounded-full">
          <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
            Join 50,000+ writers worldwide
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Write. Read.{" "}
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Connect.
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The modern platform for writers to publish their stories, build
          communities, and grow their audience. Create, collaborate, and
          inspire.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white border-0 px-8 py-6 text-lg">
            Start Writing Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent px-8 py-6 text-lg bg-transparent"
          >
            Explore Stories
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-orange-600/40 blur-3xl rounded-3xl animate-pulse"></div>
          <div className="relative bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg h-32 animate-pulse"></div>
              <div className="bg-muted rounded-lg h-32 animate-pulse"></div>
              <div className="bg-muted rounded-lg h-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
