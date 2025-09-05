import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, handleToggle };
}
