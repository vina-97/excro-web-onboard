import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage"; // from earlier

export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return [theme, toggleTheme];
}
