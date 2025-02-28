"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedCellProps {
  content: string | number | null | undefined;
  maxChars?: number;
  className?: string;
  valueType?: "text" | "number" | "price" | "quantity";
}

export function TruncatedCell({
  content,
  maxChars = 30,
  className,
  valueType = "text",
}: TruncatedCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentStr = content?.toString() || "";

  // Display placeholder for empty content
  if (!contentStr || contentStr.trim() === "") {
    return (
      <span className={cn("text-muted-foreground text-xs", className)}>-</span>
    );
  }

  // Format content based on valueType
  let formattedContent = contentStr;
  if (valueType === "price" && !isNaN(Number(content))) {
    formattedContent = `$${Number(content).toFixed(2)}`;
  } else if (valueType === "quantity" && !isNaN(Number(content))) {
    formattedContent = Number(content).toString();
  }

  const shouldTruncate = contentStr.length > maxChars && valueType === "text";

  // Don't truncate numbers, prices, quantities
  if (!shouldTruncate) {
    return (
      <span className={cn("text-sm whitespace-nowrap", className)}>
        {formattedContent}
      </span>
    );
  }

  const displayText = isExpanded
    ? formattedContent
    : `${formattedContent.substring(0, maxChars)}...`;

  return (
    <div className="inline-flex flex-col space-y-0.5 max-w-full">
      <div className="flex items-center space-x-1 max-w-full">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span
                className={cn("text-sm cursor-help truncate block", className)}
              >
                {displayText}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="max-w-xs p-2 text-xs bg-popover break-words"
            >
              {formattedContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 ml-0.5 text-xs opacity-70 hover:opacity-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "−" : "+"}
        </Button>
      </div>
    </div>
  );
}
