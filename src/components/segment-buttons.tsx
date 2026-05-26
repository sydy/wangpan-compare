"use client";

import { tabsListVariants } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentButtonsProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  /** 无障碍标签 */
  ariaLabel: string;
  className?: string;
}

/** 轻量分段选择器，避免 Base UI Tabs 在受控场景下的循环更新问题 */
export function SegmentButtons({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: SegmentButtonsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(tabsListVariants({ variant: "default" }), className)}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
