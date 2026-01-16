import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export const LandingCTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-foreground mb-6">
          Ready to share your story?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of writers building their audience on WriterHub.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white border-0 px-8 py-6 text-lg">
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent px-8 py-6 text-lg bg-transparent"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
