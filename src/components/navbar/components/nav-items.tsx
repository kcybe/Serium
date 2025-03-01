"use client";

import { useSettings } from "@/hooks/use-settings";
import InventoryButton from "./inventory-button";
import DashboardButton from "../../dashboard/dashboard-button";
import HistoryButton from "./history-button";
import SettingsButton from "./settings-button";
import { useEffect, useState } from "react";

export function NavItems() {
  const settings = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return <div className="flex space-x-1 min-w-[200px]" aria-hidden="true" />;
  }

  return (
    <>
      <InventoryButton settings={settings} />
      <DashboardButton />
      <HistoryButton />
      <SettingsButton />
    </>
  );
}
