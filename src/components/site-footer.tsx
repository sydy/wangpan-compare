import { getLatestUpdateDate } from "@/data/drives";

export function SiteFooter() {
  const latest = getLatestUpdateDate();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          价格与功能以各平台官网为准，本站仅供参考，最后更新：
          {latest}。不构成购买建议。
        </p>
      </div>
    </footer>
  );
}
