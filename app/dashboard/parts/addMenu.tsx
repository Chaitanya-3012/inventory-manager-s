import { ThemeSwitchButton } from "@/components/ui/themeSwitchButton";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import EntryForm from "./entryForm";
import { Button } from "@/components/ui/button";
export default function AddMenu({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Button
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={() => setIsOpen(false)}
      >
        <X />
      </Button>
      <div className="h-[50vh] w-[50vw] text-3xl flex items-center justify-center">
        <Label htmlFor="title" className="text-center">
          Add Menu
        </Label>
        <EntryForm />
      </div>
    </div>
  );
}
