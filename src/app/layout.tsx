import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getLatestUpdateDate } from "@/data/drives";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "网盘横评 — 国内主流网盘快速对比",
    template: "%s · 网盘横评",
  },
  description:
    "百度网盘、阿里云盘、夸克、微云、115、123云盘、天翼、迅雷等主流网盘价格、容量、功能一站式对比。",
  keywords: ["网盘对比", "百度网盘", "阿里云盘", "夸克网盘", "网盘评测"],
  openGraph: {
    title: "网盘横评 — 国内主流网盘快速对比",
    description: "价格、容量、限速、功能矩阵一站式对比",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${notoSans.variable} min-h-screen flex flex-col font-sans antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
