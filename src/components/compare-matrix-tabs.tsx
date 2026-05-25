"use client";

import { useState } from "react";
import { Minus } from "lucide-react";
import type { Drive, FeatureCategory } from "@/data/types";
import { FEATURE_CATEGORIES } from "@/data/features";
import { CATEGORY_LABELS } from "@/data/types";
import { CompareMatrixTable } from "@/components/compare-matrix-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface CompareMatrixTabsProps {
  drives: Drive[];
  diffMode: boolean;
}

export function CompareMatrixTabs({ drives, diffMode }: CompareMatrixTabsProps) {
  const [category, setCategory] = useState<FeatureCategory>(
    FEATURE_CATEGORIES[0]
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
    <Tabs
      value={category}
      onValueChange={(v) => setCategory(v as FeatureCategory)}
      className="w-full"
    >
      <TabsList className="mb-4 flex w-full flex-wrap h-auto gap-1">
        {FEATURE_CATEGORIES.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-0">
        <CompareMatrixTable
          drives={drives}
          category={category}
          diffMode={diffMode}
        />
      </div>
    </Tabs>
  );
}
