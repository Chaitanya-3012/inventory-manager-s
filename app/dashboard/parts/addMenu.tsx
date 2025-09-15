"use client";

import { ButtonIcon } from "@/components/ui/iconButton";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
export default function AddMenu({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <ButtonIcon
        className="absolute top-4 right-4"
        variant="icon"
        icon={<X />}
        text="Close"
        onClickFunction={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
      />
      <form className="h-[50vh] w-[50vw] text-3xl flex items-center justify-center">
        <Label htmlFor="title" className="text-center">
          Add Menu
        </Label>
      </form>
    </div>
  );
}
