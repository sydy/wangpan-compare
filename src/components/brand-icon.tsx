import { cn } from "@/lib/utils";

interface BrandIconProps {
  className?: string;
}

/**
 * 品牌标：双柱对比 — 简约、留白、深浅对照
 * 浅色界面：深底亮柱；深色界面：亮底暗柱
 */
export function BrandIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect
        width="32"
        height="32"
        rx="9"
        className="fill-[#0A0A0A] dark:fill-[#FAFAFA]"
      />
      <rect
        x="8.5"
        y="10"
        width="6.5"
        height="12"
        rx="3.25"
        className="fill-[#FAFAFA] dark:fill-[#171717]"
      />
      <rect
        x="17"
        y="12.5"
        width="6.5"
        height="9"
        rx="3.25"
        className="fill-[#FAFAFA] opacity-90 dark:fill-[#171717] dark:opacity-35"
      />
    </svg>
  );
}
