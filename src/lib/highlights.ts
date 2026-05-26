import type {
  Drive,
  DriveHighlight,
  HighlightCategory,
} from "@/data/types";
import { HIGHLIGHT_CATEGORY_LABELS } from "@/data/types";

const CATEGORY_ORDER: HighlightCategory[] = [
  "dev",
  "share",
  "media",
  "sync",
  "other",
];

export function getHighlightTierLabel(tier: DriveHighlight["tier"]): string | null {
  if (tier === "vip") return "会员";
  return null;
}

export function groupHighlightsByCategory(
  highlights: DriveHighlight[]
): { category: HighlightCategory; label: string; items: DriveHighlight[] }[] {
  const map = new Map<HighlightCategory, DriveHighlight[]>();
  for (const h of highlights) {
    const list = map.get(h.category) ?? [];
    list.push(h);
    map.set(h.category, list);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((category) => ({
    category,
    label: HIGHLIGHT_CATEGORY_LABELS[category],
    items: map.get(category)!,
  }));
}

/** 所选网盘特色项并集（用于稀疏矩阵行） */
export function collectHighlightRows(drives: Drive[]): {
  id: string;
  label: string;
  category: HighlightCategory;
}[] {
  const byId = new Map<
    string,
    { id: string; label: string; category: HighlightCategory }
  >();
  for (const drive of drives) {
    for (const h of drive.highlights) {
      if (!byId.has(h.id)) {
        byId.set(h.id, { id: h.id, label: h.label, category: h.category });
      }
    }
  }
  return CATEGORY_ORDER.flatMap((cat) =>
    [...byId.values()].filter((r) => r.category === cat)
  );
}

export function findHighlight(
  drive: Drive,
  highlightId: string
): DriveHighlight | undefined {
  return drive.highlights.find((h) => h.id === highlightId);
}
