"use client";

import { useEffect, useState } from "react";
import { NavDropdown } from "./nav-dropdown";

export function NavItems() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return <div className="flex space-x-1 min-w-[200px]" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center">
      <NavDropdown />
    </div>
  );
}
