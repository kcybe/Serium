// src/app/inventory/page.tsx
"use client";

import { InventoryContainer } from "@/components/inventory/inventory-container";
import { PageTransition } from "@/components/ui/page-transition";

export default function InventoryPage() {
  return (
    <PageTransition>
      <InventoryContainer />
    </PageTransition>
  );
}
