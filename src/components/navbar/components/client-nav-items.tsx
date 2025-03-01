"use client";

import { NavItems } from "./nav-items";
import { Suspense } from "react";

export function ClientNavItems() {
  return (
    <Suspense
      fallback={
        <div className="flex space-x-1 min-w-[200px]" aria-hidden="true" />
      }
    >
      <NavItems />
    </Suspense>
  );
}
