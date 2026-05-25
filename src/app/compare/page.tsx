import { Suspense } from "react";
import type { Metadata } from "next";
import { ComparePageClient } from "@/components/compare-page-client";

export const metadata: Metadata = {
  title: "网盘对比",
  description: "并排对比国内主流网盘的价格、容量、功能与客户端支持。",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<CompareSkeleton />}>
        <ComparePageClient />
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
