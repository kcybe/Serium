// src/app/inventory/components/history-alert.tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HistoryAlertProps {
  enabled: boolean;
  t: (key: string) => string;
}

export function HistoryAlert({ enabled, t }: HistoryAlertProps) {
  if (enabled) return null;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("history.disabledTitle")}</AlertTitle>
        <AlertDescription>{t("history.disabledDescription")}</AlertDescription>
      </Alert>
    </div>
  );
}
