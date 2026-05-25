"use client";

import { Check, X } from "lucide-react";
import type { Drive, FeatureCategory, FeatureKey } from "@/data/types";
import { getFeaturesByCategory } from "@/data/features";
import { DriveLogo } from "@/components/drive-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  compareFeatureValues,
  formatFeatureValueByKey,
  getDriveFeature,
  type CompareResult,
} from "@/lib/compare";
import { CompareMobile } from "@/components/compare-mobile";
import { cn } from "@/lib/utils";

function CellValue({
  value,
  featureKey,
  compareType,
  result,
  diffMode,
}: {
  value: boolean | string | number;
  featureKey: FeatureKey;
  compareType: "boolean" | "number" | "string";
  result: CompareResult;
  diffMode: boolean;
}) {
  if (compareType === "boolean" && typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
    ) : (
      <X className="size-4 text-muted-foreground/60 mx-auto" />
    );
  }

  const text = formatFeatureValueByKey(value, featureKey);
  return (
    <span
      className={cn(
        "text-sm",
        diffMode &&
          result === "better" &&
          "text-emerald-600 dark:text-emerald-400 font-medium",
        diffMode &&
          result === "worse" &&
          "text-amber-600 dark:text-amber-400",
        diffMode && result === "na" && "text-muted-foreground"
      )}
    >
      {text}
    </span>
  );
}

export function CompareMatrixTable({
  drives,
  category,
  diffMode,
}: {
  drives: Drive[];
  category: FeatureCategory;
  diffMode: boolean;
}) {
  const rows = getFeaturesByCategory(category);
  const baseline = drives[0];

  if (!baseline) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        请至少选择一款网盘进行对比
      </p>
    );
  }

  return (
    <>
      <CompareMobile drives={drives} category={category} diffMode={diffMode} />
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-20 min-w-[140px] bg-card">
                对比项
              </TableHead>
              {drives.map((drive) => (
                <TableHead
                  key={drive.id}
                  className="min-w-[120px] text-center"
                >
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <DriveLogo src={drive.logo} name={drive.name} />
                    <span className="text-xs font-semibold">{drive.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((meta) => (
              <TableRow key={meta.key}>
                <TableCell className="sticky left-0 z-10 bg-card font-medium">
                  {meta.description ? (
                    <span
                      className="cursor-help underline decoration-dotted underline-offset-4"
                      title={meta.description}
                    >
                      {meta.label}
                    </span>
                  ) : (
                    meta.label
                  )}
                </TableCell>
                {drives.map((drive, colIndex) => {
                  const value = getDriveFeature(drive, meta.key);
                  const baseValue = getDriveFeature(baseline, meta.key);
                  const result =
                    colIndex === 0 || !diffMode
                      ? "equal"
                      : compareFeatureValues(
                          baseValue,
                          value,
                          meta.compareType,
                          meta.better
                        );
                  return (
                    <TableCell key={drive.id} className="text-center">
                      <CellValue
                        value={value}
                        featureKey={meta.key}
                        compareType={meta.compareType}
                        result={result}
                        diffMode={diffMode && colIndex > 0}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
