import {
  ArrowRight,
  BookOpen,
  Users,
  Zap,
  MessageSquare,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/LandingPage/navBar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero Section */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20 blur-3xl rounded-3xl animate-pulse"></div>
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

      {/* Stats Section */}
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

      {/* Features Section */}
      <section className="py-20 px-6">
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
                Create and manage communities around your interests. Connect
                with like-minded writers and readers.
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

      {/* Testimonials Section */}
      <section className="py-20 px-6 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">
            Loved by writers everywhere
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Fiction Writer",
                quote:
                  "WriterHub helped me find my audience. My stories now reach thousands of readers every month.",
                avatar: "SC",
              },
              {
                name: "Marcus Johnson",
                role: "Tech Blogger",
                quote:
                  "The community features are incredible. I've built genuine connections with other writers in my niche.",
                avatar: "MJ",
              },
              {
                name: "Elena Rodriguez",
                role: "Poetry Creator",
                quote:
                  "Finally, a platform that values writers. The tools and support here are unmatched.",
                avatar: "ER",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-card-foreground/80 italic">{`"${testimonial.quote}"`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-foreground">WriterHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The platform for writers to share, connect, and grow.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
            <p>&copy; 2025 WriterHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
