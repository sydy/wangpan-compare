import { getFeatureMeta } from "@/data/features";
import type {
  BetterDirection,
  CompareType,
  FeatureKey,
  NumberFormat,
} from "@/data/types";
import type { Drive } from "@/data/types";

export type CompareResult = "better" | "worse" | "equal" | "na";

export function formatFeatureValue(
  value: boolean | string | number,
  compareType: CompareType,
  options?: { numberFormat?: NumberFormat; key?: FeatureKey }
): string {
  if (compareType === "boolean") {
    if (typeof value !== "boolean") return "—";
    return value ? "支持" : "不支持";
  }
  if (compareType === "number") {
    if (typeof value !== "number" || value < 0) return "—";
    const fmt = options?.numberFormat ?? "storage";
    if (fmt === "price") {
      if (value === 0) return "免费";
      const suffix =
        options?.key === "minYearlyPrice"
          ? "/年"
          : options?.key === "minMonthlyPrice"
            ? "/月"
            : "";
      return `¥${value}${suffix}`;
    }
    if (value >= 1024) return `${(value / 1024).toFixed(1)} TB`;
    return `${value} GB`;
  }
  return String(value);
}

export function formatFeatureValueByKey(
  value: boolean | string | number,
  key: FeatureKey
): string {
  const meta = getFeatureMeta(key);
  if (!meta) return String(value);
  return formatFeatureValue(value, meta.compareType, {
    numberFormat: meta.numberFormat,
    key: meta.key,
  });
}

export function compareFeatureValues(
  baseline: boolean | string | number,
  current: boolean | string | number,
  compareType: CompareType,
  better: BetterDirection
): CompareResult {
  if (compareType === "string") {
    return baseline === current ? "equal" : "na";
  }

  if (compareType === "boolean") {
    if (typeof baseline !== "boolean" || typeof current !== "boolean")
      return "na";
    if (baseline === current) return "equal";
    if (better === "lower") {
      if (!current && baseline) return "better";
      if (current && !baseline) return "worse";
    } else {
      if (current && !baseline) return "better";
      if (!current && baseline) return "worse";
    }
    return "equal";
  }

  if (compareType === "number") {
    if (typeof baseline !== "number" || typeof current !== "number")
      return "na";
    if (baseline === current) return "equal";
    if (better === "higher") {
      return current > baseline ? "better" : "worse";
    }
    if (better === "lower") {
      return current < baseline ? "better" : "worse";
    }
  }

  return "na";
}

export function getDriveFeature(
  drive: Drive,
  key: FeatureKey
): boolean | string | number {
  if (key.startsWith("client")) {
    const map: Record<string, keyof Drive["clients"]> = {
      clientWeb: "web",
      clientWin: "win",
      clientMac: "mac",
      clientIos: "ios",
      clientAndroid: "android",
    };
    const clientKey = map[key];
    if (clientKey) return drive.clients[clientKey];
  }
  return drive.features[key];
}

export function buildCompareUrl(ids: string[]): string {
  if (ids.length === 0) return "/compare";
  return `/compare?ids=${ids.join(",")}`;
}

export const SPEED_LIMIT_LABELS: Record<string, string> = {
  none: "不限速",
  soft: "轻度限速",
  hard: "严格限速",
  vip_only: "会员可用",
};
