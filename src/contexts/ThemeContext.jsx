import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../theme";

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes?.default);

  const setMerchantTheme = (merchantName) => {
    const selected = themes[merchantName] || themes?.default;
    setTheme(selected);

    // Apply dynamic CSS vars
    document.documentElement.style.setProperty(
      "--color-primary",
      selected.colors.primary,
    );
    document.documentElement.style.setProperty(
      "--color-bg",
      selected.colors.background,
    );
    document.documentElement.style.setProperty(
      "--color-text",
      selected.colors.text,
    );
    document.documentElement.style.setProperty(
      "--font-family",
      selected.typography.fontFamily,
    );
  };

  useEffect(() => {
    const merchant = localStorage.getItem("merchant") || "default";
    setMerchantTheme(merchant);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setMerchantTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
