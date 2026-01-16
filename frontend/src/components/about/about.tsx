/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Heart,
  Award,
  CheckCircle,
  Target,
  Eye,
} from "lucide-react";
// import LandingNavbar from "../LandingPage/landingNavBar";
import { Button } from "../ui/button";

export function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const values = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Empowerment",
      description:
        "We empower writers to share their voice and reach audiences worldwide without barriers.",
      color: "from-blue-500 to-orange-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description:
        "We foster genuine communities where writers can collaborate, learn, and grow together.",
      color: "from-orange-500 to-blue-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality",
      description:
        "We prioritize quality content and meaningful engagement over vanity metrics.",
      color: "from-blue-500 to-orange-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparency",
      description:
        "We believe in open communication and transparent practices with our community.",
      color: "from-orange-500 to-blue-500",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Built for Writers",
      description:
        "Our platform is designed specifically for writers, with features that make publishing, sharing, and growing your audience effortless.",
      gradient: "from-blue-500 to-orange-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Thriving Communities",
      description:
        "Connect with communities around your interests, collaborate with other writers, and build meaningful relationships.",
      gradient: "from-orange-500 to-blue-500",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics & Insights",
      description:
        "Track your story performance, understand your audience, and optimize your writing strategy with our built-in analytics.",
      gradient: "from-blue-500 to-orange-500",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Beautiful Editor",
      description:
        "Write with a powerful editor that makes formatting, media embedding, and styling your content simple and intuitive.",
      gradient: "from-orange-500 to-blue-500",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Writers" },
    { number: "1M+", label: "Stories Published" },
    { number: "500+", label: "Communities" },
    { number: "5M+", label: "Monthly Readers" },
  ];

  const faqs = [
    {
      question: "How do I get started on WriterHub?",
      answer:
        "Simply sign up with your email, create your profile, and start writing! You can publish your first story within minutes. Join communities that match your interests and connect with other writers.",
    },
    {
      question: "Is WriterHub free to use?",
      answer:
        "Yes, WriterHub is completely free to use. You can write, publish, and engage with communities at no cost. We may introduce premium features in the future, but the core platform will always be free.",
    },
    {
      question: "Can I delete my stories after publishing?",
      answer:
        "Yes, you have full control over your content. You can edit, delete, or archive your stories at any time. When you delete a story, it will be removed from the platform and readers won't be able to access it.",
    },
    {
      question: "How do I join a community?",
      answer:
        "Browse our communities section, find communities that interest you, and click 'Join'. You'll immediately have access to the community's posts and can start sharing your own content with the community.",
    },
    {
      question: "Can I monetize my writing?",
      answer:
        "WriterHub is currently a free platform focused on sharing and building community. We're exploring ways to help writers monetize their work and will share updates soon.",
    },
    {
      question: "How is my data protected?",
      answer:
        "We take data privacy seriously and comply with major data protection regulations. Your data is encrypted, and we never sell your information to third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* <LandingNavbar /> */}
      {/* Animated Gradient Background */}
      {/* <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-black to-orange-500/10"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div> */}

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex gap-2 mb-6 px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
              Empowering Writers Worldwide
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              About WriterHub
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to empower writers, build meaningful communities,
            and democratize storytelling for everyone.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everyone Needs a Community Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground font-bold mb-6 leading-tight">
              Everyone NEEDS a{" "}
              <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Imagine being a writer whether you craft compelling science
                articles, weave fictional worlds, pen heartfelt poetry, or
                document real-world experiences. The journey of writing can
                often feel solitary, but it doesn't have to be.
                <br /> Here on WriterHub, you have a vibrant community waiting
                to connect with you. Find fellow science enthusiasts who geek
                out over the latest discoveries, fiction writers who understand
                the struggle of plot holes, poets who appreciate the beauty of
                metaphor, and journalists who share your passion for truth.
                Share your drafts, get constructive feedback, celebrate your
                wins, and grow together. Because writing is better when you're
                not alone—when you have people who get it, support you, and
                inspire you to keep creating.
              </p>
            </div>
          </div>

          {/* Community Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16">
            <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-foreground font-bold mb-3">
                Find Your Tribe
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect with writers who share your interests, genre, and
                passion for storytelling.
              </p>
            </div>

            <div className="bg-black/5 dark:bg-white/5  backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-foreground font-bold mb-3">
                Grow Together
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Share feedback, learn from others, and improve your craft
                through collaboration.
              </p>
            </div>

            <div className="bg-black/5 dark:bg-white/5  backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-foreground font-bold mb-3">
                Stay Inspired
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get motivated by your community&apos;s success stories and
                creative breakthroughs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Image on Right */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground font-bold mb-6 leading-tight">
                Empowering Every{" "}
                <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                  Writer's Voice
                </span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                To create a platform where every writer, regardless of
                background or experience, can share their stories, build genuine
                communities, and reach audiences who care about their voice.
              </p>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We believe quality storytelling should be accessible to
                everyone, and we're committed to breaking down barriers that
                prevent talented writers from sharing their work with the world.
              </p>
            </div>

            <div className="order-1 lg:order-2" data-aos="fade-left">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10">
                  <picture>
                    <img
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop"
                      alt="Writers collaborating"
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Image on Left */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div data-aos="fade-right">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10">
                  <picture>
                    <img
                      src="https://images.unsplash.com/photo-1522881193457-37ae97c905bf?w=800&h=600&fit=crop"
                      alt="Vision for the future"
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 mb-6">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-500">
                  Our Vision
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground font-bold mb-6 leading-tight">
                Building the Future of{" "}
                <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                  Storytelling
                </span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
                A world where writing communities thrive, where diverse voices
                are celebrated, and where writers have the tools and support
                they need to succeed.
              </p>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We envision WriterHub as the go-to platform for storytellers
                everywhere, fostering creativity, collaboration, and connection
                across all boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl text-foreground font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                WriterHub?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to grow your writing career in one powerful
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group relative bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {benefit.icon}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                    {benefit.title}
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl text-foreground font-bold mb-4">
              Our Core{" "}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 text-center hover:scale-105"
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {value.icon}
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {value.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl text-foreground font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Everything you need to know about WriterHub
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-semibold text-left pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-500 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === idx ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 md:px-8 py-5 md:py-6 border-t border-white/10 bg-gradient-to-br from-blue-500/5 to-orange-500/5">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex gap-2 mb-6 px-4 py-2 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 rounded-full">
            <CheckCircle className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 dark:text-orange-300 text-sm font-medium">
              Join Our Growing Community
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl text-foreground font-bold mb-6 leading-tight">
            Ready to share your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
              story?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of writers building their audience and communities on
            WriterHub today.
          </p>

          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button className="group relative text-foreground bg-gradient-to-r from-blue-500 to-orange-500 px-8 md:px-10 py-4 md:py-6 rounded-xl text-base md:text-lg transition-all hover:scale-105 overflow-hidden shadow-lg hover:shadow-blue-500/50">
              <span className="relative z-10">Start Writing Free</span>
            </Button>

            <Button className="group border-2 text-foreground hover:border-blue-500 px-8 md:px-10 py-4 md:py-6 rounded-xl text-base md:text-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
