"use client";

import { Check, X } from "lucide-react";
import type { Drive, FeatureCategory } from "@/data/types";
import { getFeaturesByCategory } from "@/data/features";
import { CATEGORY_LABELS } from "@/data/types";
import { DriveLogo } from "@/components/drive-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  compareFeatureValues,
  formatFeatureValueByKey,
  getDriveFeature,
} from "@/lib/compare";
import { cn } from "@/lib/utils";

interface CompareMobileProps {
  drives: Drive[];
  category: FeatureCategory;
  diffMode: boolean;
}

export function CompareMobile({
  drives,
  category,
  diffMode,
}: CompareMobileProps) {
  const rows = getFeaturesByCategory(category);
  const baseline = drives[0];

  return (
    <div className="space-y-4 md:hidden">
      {drives.map((drive, driveIndex) => (
        <Card key={drive.id}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <DriveLogo src={drive.logo} name={drive.name} />
            <CardTitle className="text-base">{drive.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.map((meta) => {
              const value = getDriveFeature(drive, meta.key);
              const baseValue = baseline
                ? getDriveFeature(baseline, meta.key)
                : value;
              const result =
                driveIndex === 0 || !diffMode || !baseline
                  ? "equal"
                  : compareFeatureValues(
                      baseValue,
                      value,
                      meta.compareType,
                      meta.better
                    );
              const highlight = diffMode && driveIndex > 0;

              return (
                <div
                  key={meta.key}
                  className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{meta.label}</span>
                  <span
                    className={cn(
                      "font-medium",
                      highlight &&
                        result === "better" &&
                        "text-emerald-600 dark:text-emerald-400",
                      highlight &&
                        result === "worse" &&
                        "text-amber-600 dark:text-amber-400",
                      highlight && result === "na" && "text-muted-foreground"
                    )}
                  >
                    {meta.compareType === "boolean" &&
                    typeof value === "boolean" ? (
                      value ? (
                        <Check className="size-4 text-emerald-600 inline" />
                      ) : (
                        <X className="size-4 text-muted-foreground inline" />
                      )
                    ) : (
                      formatFeatureValueByKey(value, meta.key)
                    )}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
      <p className="text-xs text-center text-muted-foreground">
        {CATEGORY_LABELS[category]} · 移动端卡片视图
      </p>
    </div>
  );
}
