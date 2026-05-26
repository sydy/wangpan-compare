"use client";

import { useState } from "react";
import { ExternalLink, Minus } from "lucide-react";
import type { Drive, TierIndex } from "@/data/types";
import { TIER_LABELS } from "@/data/types";
import { getLatestUpdateDate } from "@/data/drives";
import { DriveLogo } from "@/components/drive-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SegmentButtons } from "@/components/segment-buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  compareFeatureValues,
  type CompareResult,
} from "@/lib/compare";
import {
  formatPlanPrice,
  formatPricePerGbYear,
  formatStorageGb,
  getMaxTierIndex,
  getPlanByTier,
  yearlyPricePerGb,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

type ViewMode = "tier" | "full";
type PricingRowKey = "monthly" | "yearly" | "storage" | "perGbYear" | "notes";

const PRICING_ROWS: { key: PricingRowKey; label: string }[] = [
  { key: "monthly", label: "月费（标价）" },
  { key: "yearly", label: "年费（标价）" },
  { key: "storage", label: "标称空间" },
  { key: "perGbYear", label: "元/GB·年" },
  { key: "notes", label: "备注" },
];

const TIER_OPTIONS: TierIndex[] = [1, 2, 3];

function priceCompareResult(
  baseline: number | undefined,
  current: number | undefined,
  better: "lower" | "higher"
): CompareResult {
  if (baseline === undefined || current === undefined) return "na";
  return compareFeatureValues(baseline, current, "number", better);
}

function PriceCell({
  text,
  result,
  diffMode,
}: {
  text: string;
  result: CompareResult;
  diffMode: boolean;
}) {
  return (
    <span
      className={cn(
        "text-sm",
        diffMode &&
          result === "better" &&
          "font-medium text-emerald-600 dark:text-emerald-400",
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

interface ComparePricingMatrixProps {
  drives: Drive[];
  diffMode: boolean;
}

export function ComparePricingMatrix({
  drives,
  diffMode,
}: ComparePricingMatrixProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("tier");
  const [tierIndex, setTierIndex] = useState<TierIndex>(1);

  if (drives.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Minus className="size-8 opacity-40" />
        <p>请在上方选择要对比的网盘（最多 4 个）</p>
      </div>
    );
  }

  const baseline = drives[0];
  const updatedAt = getLatestUpdateDate();

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          价格以各平台官网标价为准，更新于 {updatedAt}。同档位权益可能不完全等价，详见备注与各产品「功能」分类。
        </p>

        <SegmentButtons
          ariaLabel="套餐视图"
          value={viewMode}
          onChange={(v) => setViewMode(v as ViewMode)}
          options={[
            { value: "tier", label: "档位对齐" },
            { value: "full", label: "完整套餐" },
          ]}
        />

        {viewMode === "tier" && (
          <SegmentButtons
            ariaLabel="会员档位"
            value={String(tierIndex)}
            onChange={(v) => setTierIndex(Number(v) as TierIndex)}
            options={TIER_OPTIONS.map((t) => ({
              value: String(t),
              label: TIER_LABELS[t],
            }))}
          />
        )}

        {viewMode === "tier" ? (
          <div className="hidden md:block overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">项目</TableHead>
                  {drives.map((d) => (
                    <TableHead key={d.id} className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <DriveLogo src={d.logo} name={d.name} size="sm" />
                        <span>{d.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRICING_ROWS.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="font-medium text-muted-foreground">
                      {row.label}
                    </TableCell>
                    {drives.map((d, colIndex) => {
                      const plan = getPlanByTier(d, tierIndex);
                      const basePlan = getPlanByTier(baseline, tierIndex);
                      const isBaseline = colIndex === 0;

                      if (!plan) {
                        const maxTier = getMaxTierIndex(d);
                        return (
                          <TableCell key={d.id} className="text-center">
                            <Tooltip>
                              <TooltipTrigger className="text-muted-foreground">
                                —
                              </TooltipTrigger>
                              <TooltipContent>
                                该产品共 {maxTier} 档付费会员
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        );
                      }

                      let text = "—";
                      let result: CompareResult = "na";

                      if (row.key === "monthly") {
                        text = formatPlanPrice(plan.priceMonthly, "month");
                        if (!isBaseline && basePlan?.priceMonthly !== undefined) {
                          result = priceCompareResult(
                            basePlan.priceMonthly,
                            plan.priceMonthly,
                            "lower"
                          );
                        } else result = "equal";
                      } else if (row.key === "yearly") {
                        text = formatPlanPrice(plan.priceYearly, "year");
                        if (!isBaseline && basePlan?.priceYearly !== undefined) {
                          result = priceCompareResult(
                            basePlan.priceYearly,
                            plan.priceYearly,
                            "lower"
                          );
                        } else result = "equal";
                      } else if (row.key === "storage") {
                        text = formatStorageGb(plan.storageGb);
                        result = "na";
                      } else if (row.key === "perGbYear") {
                        text = formatPricePerGbYear(yearlyPricePerGb(plan));
                        if (!isBaseline && basePlan) {
                          result = priceCompareResult(
                            yearlyPricePerGb(basePlan),
                            yearlyPricePerGb(plan),
                            "lower"
                          );
                        } else result = "equal";
                      } else {
                        text = plan.notes ?? "—";
                        result = "na";
                      }

                      return (
                        <TableCell key={d.id}>
                          <div className="space-y-1">
                            <PriceCell
                              text={text}
                              result={result}
                              diffMode={diffMode && !isBaseline}
                            />
                            {row.key === "monthly" && (
                              <p className="text-xs text-muted-foreground">
                                {plan.name}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {drives.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <DriveLogo src={d.logo} name={d.name} size="sm" />
                  <span className="font-semibold">{d.name}</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {d.pricing.map((plan) => (
                    <li
                      key={plan.tierIndex}
                      className="border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{plan.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {TIER_LABELS[plan.tierIndex]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {formatStorageGb(plan.storageGb)}
                      </p>
                      <p>
                        {formatPlanPrice(plan.priceMonthly, "month")}{" "}
                        · {formatPlanPrice(plan.priceYearly, "year")}
                      </p>
                      <p className="text-muted-foreground">
                        {formatPricePerGbYear(yearlyPricePerGb(plan))}
                      </p>
                      {plan.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {plan.notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                {(d.pricingUrl ?? d.website) && (
                  <a
                    href={d.pricingUrl ?? d.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    查看官网定价
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {viewMode === "tier" && (
          <div className="md:hidden space-y-4">
            {drives.map((d) => {
              const plan = getPlanByTier(d, tierIndex);
              if (!plan) {
                return (
                  <div key={d.id} className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DriveLogo src={d.logo} name={d.name} size="sm" />
                      <span className="font-semibold">{d.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      无{TIER_LABELS[tierIndex]}（共 {getMaxTierIndex(d)} 档）
                    </p>
                  </div>
                );
              }
              return (
                <div key={d.id} className="rounded-xl border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DriveLogo src={d.logo} name={d.name} size="sm" />
                    <span className="font-semibold">{d.name}</span>
                  </div>
                  <p className="font-medium">{plan.name}</p>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">月费</dt>
                    <dd>{formatPlanPrice(plan.priceMonthly, "month")}</dd>
                    <dt className="text-muted-foreground">年费</dt>
                    <dd>{formatPlanPrice(plan.priceYearly, "year")}</dd>
                    <dt className="text-muted-foreground">空间</dt>
                    <dd>{formatStorageGb(plan.storageGb)}</dd>
                    <dt className="text-muted-foreground">元/GB·年</dt>
                    <dd>{formatPricePerGbYear(yearlyPricePerGb(plan))}</dd>
                  </dl>
                  {plan.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {plan.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
