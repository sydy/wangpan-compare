import { getLatestUpdateDate } from "@/data/drives";
import { PRICING_SOURCES } from "@/data/pricing-sources";

export function SiteFooter() {
  const latest = getLatestUpdateDate();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          价格与功能以各平台官网为准，本站仅供参考，最后更新：
          {latest}。不构成购买建议。
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {PRICING_SOURCES.map((source) => (
            <li key={source.driveId}>
              <a
                href={source.pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {source.name}标价
              </a>
              <span> · {source.lastReviewed}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
