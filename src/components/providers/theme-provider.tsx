import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState, createContext } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => { },
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
ThemeProviderContext.displayName = "ThemeProviderContext";

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "pointing-theme",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const finalTheme = theme === "system" ? systemTheme : theme;
  const value = {
    theme: finalTheme,
    setTheme: (theme: Theme) => setTheme(theme),
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      <div className={cn({ dark: finalTheme === "dark" })}>{children}</div>
    </ThemeProviderContext.Provider>
  );
};
