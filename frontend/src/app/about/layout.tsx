import type React from "react";
import "./about.css";
import LandingNavbar from "@/components/LandingPage/landingNavBar";

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-sans antialiased bg-white">
      <LandingNavbar />
      {children}
    </div>
  );
}
