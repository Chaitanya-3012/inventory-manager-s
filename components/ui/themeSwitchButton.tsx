"use client";

import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/lib/Theme-Switch";
export function ThemeSwitchButton({ className }: { className?: string }) {
  // Theme toggle logic
  const { theme, handleToggle } = ThemeSwitch();
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
