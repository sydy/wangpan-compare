"use client";

import { Check, X, Minus } from "lucide-react";
import type { Drive, FeatureCategory, FeatureKey } from "@/data/types";
import { FEATURES, getFeaturesByCategory } from "@/data/features";
import { CATEGORY_LABELS } from "@/data/types";
import { DriveLogo } from "@/components/drive-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  compareFeatureValues,
  formatFeatureValueByKey,
  getDriveFeature,
  type CompareResult,
} from "@/lib/compare";
import { CompareMobile } from "@/components/compare-mobile";
import { cn } from "@/lib/utils";

interface CompareMatrixProps {
  drives: Drive[];
  diffMode: boolean;
}

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
        diffMode && result === "better" && "text-emerald-600 dark:text-emerald-400 font-medium",
        diffMode && result === "worse" && "text-amber-600 dark:text-amber-400",
        diffMode && result === "na" && "text-muted-foreground"
      )}
    >
      {text}
    </span>
  );
}

function MatrixTable({
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
    <CompareMobile drives={drives} category={category} />
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
                  <Tooltip>
                    <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">
                      {meta.label}
                    </TooltipTrigger>
                    <TooltipContent>{meta.description}</TooltipContent>
                  </Tooltip>
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

export function CompareMatrix({ drives, diffMode }: CompareMatrixProps) {
  if (drives.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Minus className="size-8 opacity-40" />
        <p>请在上方选择要对比的网盘（最多 4 个）</p>
      </div>
    );
  }

  const categories = FEATURES.reduce<FeatureCategory[]>(
    (acc, f) => (acc.includes(f.category) ? acc : [...acc, f.category]),
    []
  );

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="mb-4 flex w-full flex-wrap h-auto gap-1">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((cat) => (
        <TabsContent key={cat} value={cat} className="mt-0">
          <MatrixTable drives={drives} category={cat} diffMode={diffMode} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
