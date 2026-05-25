"use client";

import { useCallback } from "react";
import { Check } from "lucide-react";
import { DRIVES } from "@/data/drives";
import type { DriveId } from "@/data/types";
import { DriveLogo } from "@/components/drive-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_SELECT = 4;

interface DrivePickerProps {
  selected: DriveId[];
  onChange: (ids: DriveId[]) => void;
  compact?: boolean;
}

export function DrivePicker({
  selected,
  onChange,
  compact = false,
}: DrivePickerProps) {
  const toggle = useCallback(
    (id: DriveId) => {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else if (selected.length < MAX_SELECT) {
        onChange([...selected, id]);
      }
    },
    [selected, onChange]
  );

  const selectAll = () => onChange(DRIVES.slice(0, MAX_SELECT).map((d) => d.id));
  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={selectAll}>
          选前 {MAX_SELECT} 个
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          清空
        </Button>
        <span className="text-sm text-muted-foreground">
          已选 {selected.length}/{MAX_SELECT}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-wrap gap-2",
          compact && "justify-center"
        )}
      >
        {DRIVES.map((drive) => {
          const isSelected = selected.includes(drive.id);
          const disabled =
            !isSelected && selected.length >= MAX_SELECT;
          return (
            <button
              key={drive.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(drive.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card hover:bg-muted",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <DriveLogo src={drive.logo} name={drive.name} size="sm" />
              <span>{drive.name}</span>
              {isSelected && <Check className="size-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
