import type { Metadata } from "next";
import { ScenarioCards } from "@/components/scenario-cards";

export const metadata: Metadata = {
  title: "场景推荐",
  description: "按看视频、备份、分享、办公等场景推荐合适的网盘。",
};

export default function ScenariosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">场景推荐</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          根据常见使用场景，结合容量、限速、功能与价格，给出 Top 2 参考选择。具体仍以你的实际需求为准。
        </p>
      </div>
      <ScenarioCards />
    </div>
  );
}
