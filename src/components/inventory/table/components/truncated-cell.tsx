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
  content: string;
  maxChars?: number;
  className?: string;
}

export function TruncatedCell({
  content,
  maxChars = 35,
  className,
}: TruncatedCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) {
    return (
      <span className={cn("text-muted-foreground text-xs", className)}>-</span>
    );
  }

  const shouldTruncate = content.length > maxChars;

  if (!shouldTruncate) {
    return <span className={cn("text-sm", className)}>{content}</span>;
  }

  const displayText = isExpanded
    ? content
    : `${content.substring(0, maxChars)}...`;

  return (
    <div className="inline-flex flex-col space-y-0.5 w-full">
      <div className="flex items-center space-x-1">
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
              {content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 ml-0.5 text-xs opacity-70 hover:opacity-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "−" : "+"}
        </Button>
      </div>
    </div>
  );
}
