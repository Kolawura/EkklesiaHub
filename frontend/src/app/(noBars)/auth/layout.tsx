import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "EkklesiaHub Auth Page",
  description: "EkklesiaHub Authentication Form Page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
