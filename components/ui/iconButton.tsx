"use client";

import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
export function ButtonIcon({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className={className}>
      <Button
        variant="secondary"
        size="icon"
        className="size-10"
        onClick={handleToggle}
      >
        {theme === "light" ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </Button>
    </div>
  );
}
