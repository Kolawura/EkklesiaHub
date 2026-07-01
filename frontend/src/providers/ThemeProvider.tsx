"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  disableTransitionOnChange?: boolean;
}

export const ThemeProvider = ({
  children,
  disableTransitionOnChange = true,
}: ThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemeProvider>
  );
};
