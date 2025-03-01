"use client";

import { MobileNav } from "./mobile-nav";
import { Suspense } from "react";

export function ClientMobileNav() {
  return (
    <Suspense fallback={<div className="w-10 h-10" aria-hidden="true" />}>
      <MobileNav />
    </Suspense>
  );
}
