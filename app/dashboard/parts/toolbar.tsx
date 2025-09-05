"use client";

import { ButtonIcon } from "@/components/ui/iconButton";
import { Plus } from "lucide-react";
import { useState } from "react";
export default function Toolbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 flex justify-end">
      <ButtonIcon
        varient="icon"
        icon={<Plus />}
        text="Add New"
        onClickFunction={(e) => {
          e.preventDefault();
          setIsOpen(true);
          console.log("Clicked");
        }}
      />
    </div>
  );
}
