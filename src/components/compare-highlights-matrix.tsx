"use client";

import { useState } from "react";
import { Minus } from "lucide-react";
import type { Drive } from "@/data/types";
import { DriveLogo } from "@/components/drive-logo";
import { Badge } from "@/components/ui/badge";
import { SegmentButtons } from "@/components/segment-buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DriveHighlights } from "@/components/drive-highlights";
import {
  collectHighlightRows,
  findHighlight,
  getHighlightTierLabel,
} from "@/lib/highlights";
import { HIGHLIGHT_CATEGORY_LABELS } from "@/data/types";

type HighlightsView = "columns" | "matrix";

interface CompareHighlightsMatrixProps {
  drives: Drive[];
}

export function CompareHighlightsMatrix({ drives }: CompareHighlightsMatrixProps) {
  const [view, setView] = useState<HighlightsView>("columns");

  if (drives.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Minus className="size-8 opacity-40" />
        <p>请在上方选择要对比的网盘（最多 4 个）</p>
      </div>
    );
  }

  const rows = collectHighlightRows(drives);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        特色为各产品差异化能力，与「功能」分类中的通用对比项不同；无该项不代表其他产品完全没有类似能力。
      </p>

      <SegmentButtons
        ariaLabel="特色视图"
        value={view}
        onChange={(v) => setView(v as HighlightsView)}
        options={[
          { value: "columns", label: "按产品" },
          { value: "matrix", label: "稀疏矩阵" },
        ]}
      />

      {view === "columns" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drives.map((d) => (
            <div key={d.id} className="rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-4">
                <DriveLogo src={d.logo} name={d.name} size="sm" />
                <span className="font-semibold">{d.name}</span>
              </div>
              <DriveHighlights highlights={d.highlights} />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">特色项</TableHead>
                {drives.map((d) => (
                  <TableHead key={d.id} className="min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <DriveLogo src={d.logo} name={d.name} size="sm" />
                      <span className="text-xs">{d.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <span className="font-medium text-sm">{row.label}</span>
                      <p className="text-xs text-muted-foreground">
                        {HIGHLIGHT_CATEGORY_LABELS[row.category]}
                      </p>
                    </div>
                  </TableCell>
                  {drives.map((d) => {
                    const h = findHighlight(d, row.id);
                    if (!h) {
                      return (
                        <TableCell
                          key={d.id}
                          className="text-center text-muted-foreground"
                        >
                          —
                        </TableCell>
                      );
                    }
                    const tierLabel = getHighlightTierLabel(h.tier);
                    return (
                      <TableCell key={d.id} className="align-top text-sm">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            支持
                          </span>
                          {tierLabel && (
                            <Badge variant="outline" className="text-xs">
                              {tierLabel}
                            </Badge>
                          )}
                        </div>
                        {h.description && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {h.description}
                          </p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
