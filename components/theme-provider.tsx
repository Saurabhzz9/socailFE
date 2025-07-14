"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="nebula-dark"
      enableSystem={false}
      themes={[
        "light",
        "dark",
        "nebula-dark",
        "cawar-orange",
        "matrix-green",
        "cyber-blue",
        "cosmic-purple",
        "fire-red",
        "neon-pink",
        "ocean-teal",
        "sunset-gold",
      ]}
      storageKey="quolo-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
