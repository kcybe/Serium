// src/app/inventory/hooks/use-item-actions.tsx
import { useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/services/db";
import { historyService } from "@/lib/services/history";
import { inventoryService } from "@/lib/services/inventory";
import { type InventoryItem } from "@/types/inventory";
import { type SiteSettings } from "@/types/settings";

export function useItemActions(
  data: InventoryItem[],
  setData: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  t: (key: string, options?: any) => string
) {
  const handleAddItem = async (newItem: InventoryItem) => {
    try {
      await historyService.trackChange(
        newItem.id,
        "create",
        undefined,
        newItem
      );
      setData((prev) => [...prev, newItem]);
      toast.success(t("toast.itemAdded"));
    } catch (error) {
      console.error(error);
      toast.error(t("toast.itemAddError"));
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: InventoryItem) => {
    try {
      const oldItem = await db.inventory.get(id);
      if (!oldItem) {
        throw new Error("Item not found");
      }

      const processedItem: InventoryItem = {
        ...oldItem,
        ...updatedItem,
        sku: updatedItem.sku,
        quantity: Number(updatedItem.quantity),
        price: Number(updatedItem.price),
      };

      await db.inventory.update(id, processedItem);
      setData((prev) =>
        prev.map((item) => (item.id === id ? processedItem : item))
      );
      toast.success(t("toast.itemUpdated"));
    } catch (e) {
      const error = e instanceof Error ? e : new Error("Unknown error");
      toast.error(t("toast.itemUpdateError", { error: error.message }));
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const oldItem = await db.inventory.get(id);
      if (!oldItem) return;

      await db.inventory.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      await historyService.trackChange(id, "delete", oldItem);
      toast.success(t("toast.itemDeleted"));
    } catch (error) {
      toast.error(
        t("toast.itemDeleteError", {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const handleVerify = async (
    id: string,
    source: "scan" | "button" = "button",
    isVerifying: React.MutableRefObject<boolean>
  ) => {
    if (isVerifying.current) return;
    isVerifying.current = true;

    try {
      const updatedItem = await inventoryService.verifyItem(id);
      setData((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));

      if (source === "scan") {
        toast.success(
          t("toast.scanVerifySuccess", {
            itemName: updatedItem.name,
            sku: String(updatedItem.sku),
          })
        );
      } else {
        toast.success(t("toast.verifySuccess"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("toast.verifyError"));
    } finally {
      setTimeout(() => {
        isVerifying.current = false;
      }, 100);
    }
  };

  return {
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleVerify,
  };
}
