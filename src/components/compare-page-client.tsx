"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { ALL_DRIVE_IDS, getDrivesByIds } from "@/data/drives";
import type { DriveId } from "@/data/types";
import { CompareMatrix } from "@/components/compare-matrix";
import { DrivePicker } from "@/components/drive-picker";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

function parseIds(param: string | null): DriveId[] {
  if (!param) return ALL_DRIVE_IDS.slice(0, 4);
  const ids = param.split(",").filter((id): id is DriveId =>
    ALL_DRIVE_IDS.includes(id as DriveId)
  );
  return ids.length > 0 ? ids.slice(0, 4) : ALL_DRIVE_IDS.slice(0, 4);
}

export function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<DriveId[]>(() =>
    parseIds(searchParams.get("ids"))
  );
  const [diffMode, setDiffMode] = useState(true);

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
    const fromUrl = parseIds(searchParams.get("ids"));
    setSelected((prev) => {
      if (prev.join(",") === fromUrl.join(",")) return prev;
      return fromUrl;
    });
  }, [searchParams]);

  const shareLink = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
    }
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
        <Button variant="outline" size="sm" onClick={shareLink}>
          <Share2 className="size-4" />
          复制分享链接
        </Button>
      </div>

      <CompareMatrix drives={drives} diffMode={diffMode} />
    </div>
  );
}
