"use client";
import Link from "next/link";
import { ArrowRight, Home, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-pattern"></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/10 dark:bg-pink-400/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative max-w-2xl w-full text-center space-y-8 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Decorative compass icon */}
        <div className="flex justify-center relative">
          <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 animate-pulse-slow blur-2xl"></div>
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-full shadow-2xl ring-8 ring-gray-200/50 dark:ring-gray-800/50 animate-float">
            <Compass className="w-16 h-16 text-gray-700 dark:text-gray-300 animate-spin-slow" />
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-3">
          <div className="text-8xl md:text-9xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 dark:from-gray-600 dark:via-gray-400 dark:to-gray-600 animate-gradient">
            404
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tight">
            Page not found
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-lg mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-md mx-auto">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black rounded-full font-medium shadow-xl shadow-gray-900/20 dark:shadow-white/20 hover:shadow-2xl hover:shadow-gray-900/30 dark:hover:shadow-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Home className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative">Go Home</span>
            <ArrowRight className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-full font-medium border-2 border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <ArrowRight className="w-5 h-5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="pt-8">
          <p className="text-sm text-gray-700 dark:text-gray-400 font-light mb-4">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/about"
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/help"
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="pb-4 flex justify-center gap-6 opacity-30">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
