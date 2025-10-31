import type React from "react";
import "./landing.css";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="font-sans antialiased bg-white">{children}</div>;
}
