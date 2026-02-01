"use client";

import { useEffect, useState } from "react";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/lib/Theme-Switch";
export function ThemeSwitchButton({ className }: { className?: string }) {
  // Theme toggle logic
  const { theme, handleToggle } = ThemeSwitch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={className}>
      <Button
        variant="secondary"
        size="icon"
        className="size-10"
        onClick={handleToggle}
      >
        {mounted ? (
          theme === "light" ? (
            <Moon className="size-5" />
          ) : (
            <Sun className="size-5" />
          )
        ) : (
          // placeholder to preserve layout until hydration
          <span className="size-5 inline-block" aria-hidden />
        )}
      </Button>
    </div>
  );
}
