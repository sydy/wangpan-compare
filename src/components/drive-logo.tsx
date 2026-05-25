import Image from "next/image";
import { cn } from "@/lib/utils";

interface DriveLogoProps {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { sm: 28, md: 36, lg: 48, xl: 64 };

export function DriveLogo({ src, name, size = "md", className }: DriveLogoProps) {
  const px = sizes[size];

  return (
    <Image
      src={src}
      alt={`${name} 图标`}
      width={px}
      height={px}
      quality={75}
      sizes={`${px}px`}
      className={cn(
        "shrink-0 rounded-[22%] object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
      style={{ width: px, height: px }}
    />
  );
}
