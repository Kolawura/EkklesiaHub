"use client";

import Link from "next/link";
// import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/useSideBarStore";
import { X, Menu } from "lucide-react";

export default function LandingNavbar() {
  const { OpenMobileMenu, setOpenMobileMenu } = useSidebarStore();

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent hidden sm:inline">
              WriterHub
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant={"ghost"}
              className="hidden md:block px-6 py-2 text-foreground/70 font-medium hover:text-primary transition-colors"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button className="hidden md:block px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all">
              <Link href="/auth">Get Started</Link>
            </Button>
            {/* Mobile menu button */}
            <Button
              onClick={() => setOpenMobileMenu(!OpenMobileMenu)}
              className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
            >
              {OpenMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {OpenMobileMenu && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground/75 hover:text-primary hover:bg-card rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground bg-card rounded-lg"
            >
              About
            </Link>
            <Link
              href="/communities"
              className="block px-4 py-2 text-foreground/75 hover:text-primary hover:bg-card rounded-lg transition-colors"
            >
              Communities
            </Link>
            <button className="w-full mt-4 px-4 py-2 text-foreground/75 font-medium hover:text-primary transition-colors">
              Sign In
            </button>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg hover:shadow-lg transition-all">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
