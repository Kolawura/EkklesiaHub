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
      attribute="data-theme"
      defaultTheme="sacred"
      themes={["sacred", "light", "dark", "midnight", "sepia", "forest", "rose", "papyrus", "obsidian", "byzantine"]}
      enableSystem={false}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemeProvider>
  );
};