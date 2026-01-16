"use client";
import LandingNavbar from "@/components/LandingPage/landingNavBar";
import { LandingHeroSection } from "@/components/LandingPage/LandingHeroSection";
import { LandingStatsSection } from "@/components/LandingPage/LandingStatsSection";
import { LandingFeatureSection } from "@/components/LandingPage/LandingFeatureSection";
import { LandingTestimonialSection } from "@/components/LandingPage/LandingTestimonialSection";
import { LandingCTASection } from "@/components/LandingPage/LandingCTASection";
import { LandingFooter } from "@/components/LandingPage/LandingFooter";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      {/* Hero Section */}
      <LandingHeroSection />
      {/* Stats Section */}
      <LandingStatsSection />
      {/* Features Section */}
      <LandingFeatureSection />
      {/* Testimonials Section */}
      <LandingTestimonialSection />
      {/* CTA Section */}
      <LandingCTASection />
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
