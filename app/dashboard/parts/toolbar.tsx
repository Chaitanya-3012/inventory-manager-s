"use client";

import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import EntryForm from "./entryForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 flex justify-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="default">
            <Plus />
            Add New
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <EntryForm />
        </PopoverContent>
      </Popover>
      <Button variant="secondary" className="ml-2">
        Export
      </Button>
    </div>
  );
}
