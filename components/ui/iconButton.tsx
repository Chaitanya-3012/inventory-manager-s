"use client";

import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/lib/Theme-Switch";
import { on } from "events";
export function ButtonIcon({
  className,
  varient,
  text,
  icon,
  onClickFunction = (e) => {},
}: {
  className?: string;
  varient?: "theme" | "icon";
  text?: string;
  icon?: React.ReactNode;
  onClickFunction?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}) {
  // Theme toggle logic
  const { theme, handleToggle } = ThemeSwitch();
  return (
    <div className={className}>
      {varient === "theme" ? (
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
      ) : (
        <Button variant="secondary" size="default" onClick={onClickFunction}>
          {icon}
          {text ? text : ""}
        </Button>
      )}
    </div>
  );
}
