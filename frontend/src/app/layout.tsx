import type { Metadata, Viewport } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { StoreHydrator } from "@/providers/StoreHydrator";

export const metadata: Metadata = {
  title: "EkklesiaHub — Write. Connect. Inspire.",
  description:
    "The writing and community platform for faith-driven authors, theologians, pastors, and spiritual thinkers. Build your readership, find your community.",
};

// Explicit viewport: device-width scaling, and `cover` so env(safe-area-inset-*)
// works on notched phones. (Pinch-zoom is deliberately left enabled for a11y.)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider disableTransitionOnChange>
          <ReactQueryProvider>
            <StoreHydrator>
              {children}
              <Toaster />
            </StoreHydrator>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
