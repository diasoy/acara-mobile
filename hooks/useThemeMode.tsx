import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const themeMode: ThemeMode = colorScheme === "light" ? "light" : "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      isDarkMode: themeMode === "dark",
    }),
    [themeMode],
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode harus digunakan di dalam ThemeProvider.");
  }

  return context;
}
