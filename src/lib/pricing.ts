import type { Drive, DrivePlan, TierIndex } from "@/data/types";
import { TIER_LABELS } from "@/data/types";

export function getPlanByTier(
  drive: Drive,
  tierIndex: TierIndex
): DrivePlan | undefined {
  return drive.pricing.find((p) => p.tierIndex === tierIndex);
}

export function getMaxTierIndex(drive: Drive): TierIndex {
  return Math.max(...drive.pricing.map((p) => p.tierIndex)) as TierIndex;
}

export function getTierLabel(tierIndex: TierIndex): string {
  return TIER_LABELS[tierIndex];
}

/** 年付折算每 GB·年的价格（元）；无年付或容量为 0 时返回 undefined */
export function yearlyPricePerGb(plan: DrivePlan): number | undefined {
  if (!plan.priceYearly || plan.storageGb <= 0) return undefined;
  return Math.round((plan.priceYearly / plan.storageGb) * 100) / 100;
}

export function formatPlanPrice(
  amount: number | undefined,
  period: "month" | "year"
): string {
  if (amount === undefined) return "—";
  const suffix = period === "month" ? "/月" : "/年";
  return `¥${amount}${suffix}`;
}

export function formatStorageGb(gb: number): string {
  if (gb >= 1024) {
    const tb = gb / 1024;
    return Number.isInteger(tb) ? `${tb} TB` : `${tb.toFixed(1)} TB`;
  }
  return `${gb} GB`;
}

export function formatPricePerGbYear(value: number | undefined): string {
  if (value === undefined) return "—";
  return `¥${value.toFixed(2)}/GB·年`;
}

export function minMonthlyFromPlans(plans: DrivePlan[]): number | undefined {
  const prices = plans
    .map((p) => p.priceMonthly)
    .filter((p): p is number => p !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function minYearlyFromPlans(plans: DrivePlan[]): number | undefined {
  const prices = plans
    .map((p) => p.priceYearly)
    .filter((p): p is number => p !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}
