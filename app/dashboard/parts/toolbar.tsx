"use client";

import { ButtonIcon } from "@/components/ui/iconButton";
import { Plus } from "lucide-react";

type ToolbarProps = {
  onAddClick: () => void;
};

export default function Toolbar({ onAddClick }: ToolbarProps) {
  return (
    <div className="mb-4 flex justify-end">
      <ButtonIcon
        variant="icon"
        icon={<Plus />}
        text="Add New"
        onClickFunction={(e) => {
          e.preventDefault();
          onAddClick();
        }}
      />
    </div>
  );
}
