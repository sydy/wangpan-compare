"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DRIVES } from "@/data/drives";
import type { DriveId } from "@/data/types";
import { buildCompareUrl } from "@/lib/compare";
import { DriveLogo } from "@/components/drive-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickCompare() {
  const router = useRouter();
  const [selected, setSelected] = useState<DriveId[]>([]);

  const toggle = (id: DriveId) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const goCompare = () => {
    const ids =
      selected.length > 0
        ? selected
        : (DRIVES.slice(0, 3).map((d) => d.id) as DriveId[]);
    router.push(buildCompareUrl(ids));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">快速对比</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        点选网盘（最多 4 个），一键进入对比页
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {DRIVES.map((drive) => {
          const on = selected.includes(drive.id);
          return (
            <button
              key={drive.id}
              type="button"
              onClick={() => toggle(drive.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 transition-all",
                on
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border hover:bg-muted"
              )}
            >
              <DriveLogo src={drive.logo} name={drive.name} size="sm" />
              <span className="text-sm font-medium">{drive.name}</span>
            </button>
          );
        })}
      </div>
      <Button className="mt-5" onClick={goCompare}>
        开始对比
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
