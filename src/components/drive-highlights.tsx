import type { DriveHighlight } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { getHighlightTierLabel, groupHighlightsByCategory } from "@/lib/highlights";

interface DriveHighlightsProps {
  highlights: DriveHighlight[];
  /** compact 用于首页卡片等窄空间 */
  variant?: "default" | "compact";
}

export function DriveHighlights({
  highlights,
  variant = "default",
}: DriveHighlightsProps) {
  if (variant === "compact") {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {highlights.map((h) => (
          <li key={h.id}>
            <Badge variant="secondary" className="text-xs font-normal">
              {h.label}
            </Badge>
          </li>
        ))}
      </ul>
    );
  }

  const groups = groupHighlightsByCategory(highlights);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {group.label}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((h) => {
              const tierLabel = getHighlightTierLabel(h.tier);
              return (
                <li
                  key={h.id}
                  className="rounded-lg border border-border px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm">{h.label}</span>
                    {tierLabel && (
                      <Badge variant="outline" className="text-xs">
                        {tierLabel}
                      </Badge>
                    )}
                  </div>
                  {h.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {h.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
