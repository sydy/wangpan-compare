import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { DRIVES, getDriveById } from "@/data/drives";
import { FEATURES } from "@/data/features";
import { DriveLogo } from "@/components/drive-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatFeatureValueByKey,
  getDriveFeature,
  SPEED_LIMIT_LABELS,
} from "@/lib/compare";
import { buildCompareUrl } from "@/lib/compare";
import { JsonLd } from "@/components/json-ld";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DRIVES.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const drive = getDriveById(id);
  if (!drive) return { title: "未找到" };
  return {
    title: drive.name,
    description: `${drive.tagline} — 套餐、功能与优缺点详情。`,
  };
}

export default async function DriveDetailPage({ params }: PageProps) {
  const { id } = await params;
  const drive = getDriveById(id);
  if (!drive) notFound();

  const siteUrl = getSiteUrl();
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: drive.name,
    description: drive.tagline,
    url: drive.website,
    applicationCategory: "UtilitiesApplication",
    offers: drive.pricing.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.priceMonthly ?? plan.priceYearly ?? 0,
      priceCurrency: "CNY",
    })),
    mainEntityOfPage: `${siteUrl}/drive/${drive.id}`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={softwareJsonLd} />
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" render={<Link href="/" />}>
        <ArrowLeft className="size-4" />
        返回首页
      </Button>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <DriveLogo src={drive.logo} name={drive.name} size="xl" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{drive.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{drive.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{drive.freeStorageGb} GB 免费</Badge>
            <Badge variant="outline">
              {SPEED_LIMIT_LABELS[drive.speedLimit]}
            </Badge>
            <Badge variant="secondary">更新于 {drive.updatedAt}</Badge>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<Link href={buildCompareUrl([drive.id])} />}>
              加入对比
            </Button>
            <Button variant="outline" render={<a href={drive.website} target="_blank" rel="noopener noreferrer" />}>
              访问官网
              <ExternalLink className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-emerald-600 dark:text-emerald-400">
              优点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {drive.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-600 dark:text-amber-400">
              缺点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {drive.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">套餐价格</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">套餐</th>
                <th className="px-4 py-3 text-left font-medium">容量</th>
                <th className="px-4 py-3 text-left font-medium">月费</th>
                <th className="px-4 py-3 text-left font-medium">年费</th>
                <th className="px-4 py-3 text-left font-medium">备注</th>
              </tr>
            </thead>
            <tbody>
              {drive.pricing.map((plan) => (
                <tr key={plan.name} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{plan.name}</td>
                  <td className="px-4 py-3">{plan.storageGb} GB</td>
                  <td className="px-4 py-3">
                    {plan.priceMonthly ? `¥${plan.priceMonthly}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {plan.priceYearly ? `¥${plan.priceYearly}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {plan.notes ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">功能清单</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((meta) => {
            const value = getDriveFeature(drive, meta.key);
            return (
              <div
                key={meta.key}
                className="flex justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">{meta.label}</span>
                <span className="font-medium">
                  {formatFeatureValueByKey(value, meta.key)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Separator className="my-12" />
      <p className="text-sm text-muted-foreground text-center">
        数据更新于 {drive.updatedAt}，请以 {drive.name} 官网为准。
      </p>
    </div>
  );
}
