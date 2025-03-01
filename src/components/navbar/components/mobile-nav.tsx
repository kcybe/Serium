"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavItems } from "./nav-items";

interface MobileNavProps {
  label?: string;
}

export function MobileNav({ label = "Navigation" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-4 pr-0">
        <SheetHeader className="text-left">
          <SheetTitle className="sr-only">{label}</SheetTitle>
        </SheetHeader>
        <NavItems />
      </SheetContent>
    </Sheet>
  );
}
