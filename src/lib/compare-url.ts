import { ALL_DRIVE_IDS } from "@/data/drives";
import type { DriveId } from "@/data/types";

export function parseCompareIds(param: string | null | undefined): DriveId[] {
  if (!param) return ALL_DRIVE_IDS.slice(0, 4);
  const ids = param
    .split(",")
    .filter((id): id is DriveId => ALL_DRIVE_IDS.includes(id as DriveId));
  return ids.length > 0 ? ids.slice(0, 4) : ALL_DRIVE_IDS.slice(0, 4);
}
