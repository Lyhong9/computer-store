"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("app_theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      // Default to light for clean Shopeers dashboard, unless system explicitly set
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = systemDark ? "dark" : "light";
      setThemeState(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    let dark = false;
    if (t === "dark") {
      dark = true;
    } else if (t === "system") {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      dark = false;
    }

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setIsDark(dark);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("app_theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
