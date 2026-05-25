import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/compare", label: "对比" },
  { href: "/scenarios", label: "场景推荐" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground"
        >
          <BrandIcon className="size-8 shadow-sm" />
          <span className="hidden sm:inline text-[15px] tracking-wide">
            网盘横评
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" render={<Link href={item.href} />}>
              {item.label}
            </Button>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
