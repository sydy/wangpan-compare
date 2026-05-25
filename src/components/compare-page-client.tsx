"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { getDrivesByIds } from "@/data/drives";
import type { DriveId } from "@/data/types";
import { CompareMatrix } from "@/components/compare-matrix";
import { DrivePicker } from "@/components/drive-picker";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { parseCompareIds } from "@/lib/compare-url";

interface ComparePageClientProps {
  initialSelected: DriveId[];
}

export function ComparePageClient({ initialSelected }: ComparePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<DriveId[]>(initialSelected);
  const [diffMode, setDiffMode] = useState(true);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const drives = useMemo(() => getDrivesByIds(selected), [selected]);

  const syncUrl = useCallback(
    (ids: DriveId[]) => {
      const params = new URLSearchParams();
      if (ids.length > 0) params.set("ids", ids.join(","));
      const q = params.toString();
      router.replace(q ? `/compare?${q}` : "/compare", { scroll: false });
    },
    [router]
  );

  const handleChange = useCallback(
    (ids: DriveId[]) => {
      setSelected(ids);
      syncUrl(ids);
    },
    [syncUrl]
  );

  useEffect(() => {
    const fromUrl = parseCompareIds(searchParams.get("ids"));
    setSelected((prev) => {
      if (prev.join(",") === fromUrl.join(",")) return prev;
      return fromUrl;
    });
  }, [searchParams]);

  const shareLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareHint("链接已复制");
    } catch {
      setShareHint("复制失败，请手动复制地址栏链接");
    }
    window.setTimeout(() => setShareHint(null), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">网盘对比</h1>
        <p className="mt-2 text-muted-foreground">
          选择最多 4 款网盘，按分类查看差异。基准列为第一款。
        </p>
      </div>

      <DrivePicker selected={selected} onChange={handleChange} />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Toggle
            pressed={diffMode}
            onPressedChange={setDiffMode}
            aria-label="差异高亮"
          />
          <span className="text-sm">差异高亮</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => void shareLink()}>
          <Share2 className="size-4" />
          复制分享链接
        </Button>
        {shareHint && (
          <span className="text-sm text-muted-foreground" role="status">
            {shareHint}
          </span>
        )}
      </div>

      <CompareMatrix drives={drives} diffMode={diffMode} />
    </div>
  );
}
