"use client";

import { useMemo, useState } from "react";
import { Minus } from "lucide-react";
import type { Drive, FeatureCategory } from "@/data/types";
import { FEATURE_CATEGORIES } from "@/data/features";
import { CATEGORY_LABELS } from "@/data/types";
import { CompareMatrixTable } from "@/components/compare-matrix-table";
import { ComparePricingMatrix } from "@/components/compare-pricing-matrix";
import { SegmentButtons } from "@/components/segment-buttons";

/** 会员套餐对比（勿与 FeatureCategory 的 pricing「价格」维度混淆） */
type CompareTab = FeatureCategory | "membership";

interface CompareMatrixTabsProps {
  drives: Drive[];
  diffMode: boolean;
}

export function CompareMatrixTabs({ drives, diffMode }: CompareMatrixTabsProps) {
  const [category, setCategory] = useState<CompareTab>(
    FEATURE_CATEGORIES[0]
  );

  const tabOptions = useMemo(
    () => [
      ...FEATURE_CATEGORIES.map((cat) => ({
        value: cat,
        label: CATEGORY_LABELS[cat],
      })),
      { value: "membership", label: "会员套餐" },
    ],
    []
  );

  if (drives.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Minus className="size-8 opacity-40" />
        <p>请在上方选择要对比的网盘（最多 4 个）</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <SegmentButtons
        ariaLabel="对比分类"
        value={category}
        onChange={(v) => setCategory(v as CompareTab)}
        options={tabOptions}
        className="mb-0 flex w-full flex-wrap h-auto gap-1"
      />
      <div>
        {category === "membership" ? (
          <ComparePricingMatrix drives={drives} diffMode={diffMode} />
        ) : (
          <CompareMatrixTable
            drives={drives}
            category={category}
            diffMode={diffMode}
          />
        )}
      </div>
    </div>
  );
}
