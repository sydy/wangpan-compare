import { Suspense } from "react";
import type { Metadata } from "next";
import { getDrivesByIds } from "@/data/drives";
import { ComparePageClient } from "@/components/compare-page-client";
import { parseCompareIds } from "@/lib/compare-url";

export const metadata: Metadata = {
  title: "网盘对比",
  description: "并排对比国内主流网盘的价格、容量、功能与客户端支持。",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { ids: idsParam } = await searchParams;
  const initialSelected = parseCompareIds(idsParam ?? null);
  const initialDrives = getDrivesByIds(initialSelected);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<CompareSkeleton />}>
        <ComparePageClient initialSelected={initialSelected} />
        <noscript>
          <p className="mt-8 text-sm text-muted-foreground">
            已选：{initialDrives.map((d) => d.name).join("、")}
          </p>
        </noscript>
      </Suspense>
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-lg bg-muted" />
      <div className="h-24 rounded-xl bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}
