import {
  BookOpen,
  Users,
  TrendingUp,
  MessageSquare,
  Zap,
  Star,
} from "lucide-react";
import React from "react";

export const LandingFeatureSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">
          Everything you need to succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Rich Editor
            </h3>
            <p className="text-card-foreground/70">
              Write with our powerful editor featuring formatting, media
              embedding, and real-time collaboration.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Build Communities
            </h3>
            <p className="text-card-foreground/70">
              Create and manage communities around your interests. Connect with
              like-minded writers and readers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Grow Your Audience
            </h3>
            <p className="text-card-foreground/70">
              Analytics, recommendations, and discovery tools to help your
              stories reach the right readers.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Engage Readers
            </h3>
            <p className="text-card-foreground/70">
              Comments, reactions, and discussions to build meaningful
              connections with your audience.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Lightning Fast
            </h3>
            <p className="text-card-foreground/70">
              Optimized for speed and performance. Your stories load instantly
              for readers worldwide.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/50 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Premium Features
            </h3>
            <p className="text-card-foreground/70">
              Monetize your content, access advanced analytics, and unlock
              exclusive creator tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
