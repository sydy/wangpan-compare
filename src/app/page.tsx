import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { DRIVES } from "@/data/drives";
import { DriveCard } from "@/components/drive-card";
import { QuickCompare } from "@/components/quick-compare";
import { ScenarioCards } from "@/components/scenario-cards";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <BarChart3 className="size-3.5" />
              {DRIVES.length} 款主流网盘 · 静态数据 · 快速对比
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              选对网盘，少花冤枉钱
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              价格、容量、限速、功能矩阵一目了然。勾选几款即可并排对比，还能按看视频、备份、分享等场景找推荐。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" render={<Link href="/compare" />}>
                查看完整对比
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/scenarios" />}>
                场景推荐
              </Button>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <QuickCompare />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">全部网盘</h2>
        <p className="mt-2 text-muted-foreground">
          点击卡片查看详情，或直接进入对比
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DRIVES.map((drive) => (
            <DriveCard key={drive.id} drive={drive} />
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">按场景选盘</h2>
          <p className="mt-2 text-muted-foreground mb-8">
            不知道选哪家？从这些常见用途出发
          </p>
          <ScenarioCards compact />
        </div>
      </section>
    </div>
  );
}
