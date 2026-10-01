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

/** 多年套餐按整段年数折算；缺少年数时不假装成 1 年 */
export function planTermYears(plan: DrivePlan): number | undefined {
  if (plan.billingPeriod === "multi_year") {
    return plan.durationYears !== undefined && plan.durationYears >= 2
      ? plan.durationYears
      : undefined;
  }
  return 1;
}

/** 年付折算每 GB·年的价格（元）；无年付、容量为 0，或多年套餐缺少年数时返回 undefined */
export function yearlyPricePerGb(plan: DrivePlan): number | undefined {
  if (!plan.priceYearly || plan.storageGb <= 0) return undefined;
  const years = planTermYears(plan);
  if (years === undefined) return undefined;
  const value = plan.priceYearly / years / plan.storageGb;
  const scale = value > 0 && value < 0.01 ? 10000 : 100;
  return Math.round(value * scale) / scale;
}

export function formatPlanPrice(
  amount: number | undefined,
  period: "month" | "year"
): string {
  if (amount === undefined) return "—";
  const suffix = period === "month" ? "/月" : "/年";
  return `¥${amount}${suffix}`;
}

/** 年费展示。多年套餐显示总价/N年，避免被读成 1 年标价 */
/** 把多年总价折成每年，供「更便宜」比较；展示仍用 formatPlanYearly */
export function annualizedYearlyPrice(plan: DrivePlan): number | undefined {
  if (plan.priceYearly === undefined) return undefined;
  const years = planTermYears(plan);
  if (years === undefined) return undefined;
  return plan.priceYearly / years;
}

export function formatPlanYearly(plan: DrivePlan): string {
  if (plan.priceYearly === undefined) return "—";
  if (
    plan.billingPeriod === "multi_year" &&
    plan.durationYears !== undefined &&
    plan.durationYears >= 2
  ) {
    return `¥${plan.priceYearly}/${plan.durationYears}年`;
  }
  return formatPlanPrice(plan.priceYearly, "year");
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
  const digits = value > 0 && value < 0.01 ? 4 : 2;
  return `¥${value.toFixed(digits)}/GB·年`;
}

function isMembershipPlan(plan: DrivePlan): boolean {
  return plan.kind !== "storage_addon";
}

export function minMonthlyFromPlans(plans: DrivePlan[]): number | undefined {
  const prices = plans
    .filter(isMembershipPlan)
    .map((p) => p.priceMonthly)
    .filter((p): p is number => p !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

/** 最低年费只统计 1 年期会员，多年套餐总价不参与 */
export function minYearlyFromPlans(plans: DrivePlan[]): number | undefined {
  const prices = plans
    .filter(
      (p) =>
        isMembershipPlan(p) &&
        p.billingPeriod !== "multi_year" &&
        (p.durationYears === undefined || p.durationYears === 1) &&
        p.priceYearly !== undefined
    )
    .map((p) => p.priceYearly as number);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}
