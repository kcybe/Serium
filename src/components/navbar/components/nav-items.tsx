"use client";

import { useSettings } from "@/hooks/use-settings";
import InventoryButton from "./inventory-button";
import DashboardButton from "../../dashboard/dashboard-button";
import HistoryButton from "./history-button";
import SettingsButton from "./settings-button";

export function NavItems() {
  const settings = useSettings();

  return (
    <>
      <InventoryButton settings={settings} />
      <DashboardButton />
      <HistoryButton />
      <SettingsButton />
    </>
  );
}
