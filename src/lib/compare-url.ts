import { ALL_DRIVE_IDS, DEFAULT_COMPARE_IDS } from "@/data/drives";
import type { DriveId } from "@/data/types";

/** 显式空选择。不能省略 ids，否则会和「未指定」一样回落到默认四款 */
export const EMPTY_COMPARE_TOKEN = "none";

export function parseCompareIds(param: string | null | undefined): DriveId[] {
  if (param == null) return [...DEFAULT_COMPARE_IDS];
  const trimmed = param.trim();
  if (trimmed === "" || trimmed === EMPTY_COMPARE_TOKEN) return [];
  const ids = trimmed
    .split(",")
    .map((id) => id.trim())
    .filter((id): id is DriveId => ALL_DRIVE_IDS.includes(id as DriveId));
  return [...new Set(ids)].slice(0, 4);
}
