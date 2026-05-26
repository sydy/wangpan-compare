import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Drive } from "@/data/types";
import { DriveLogo } from "@/components/drive-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SPEED_LIMIT_LABELS } from "@/lib/compare";
import { DriveHighlights } from "@/components/drive-highlights";

interface DriveCardProps {
  drive: Drive;
}

export function DriveCard({ drive }: DriveCardProps) {
  const minMonthly = drive.features.minMonthlyPrice as number;

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        <DriveLogo src={drive.logo} name={drive.name} size="lg" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/drive/${drive.id}`}
            className="font-semibold hover:text-primary transition-colors"
          >
            {drive.name}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {drive.tagline}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{drive.freeStorageGb} GB 免费</Badge>
          <Badge variant="outline">
            {SPEED_LIMIT_LABELS[drive.speedLimit]}
          </Badge>
          {minMonthly > 0 && (
            <Badge variant="outline">¥{minMonthly}/月起</Badge>
          )}
          <Badge variant="outline">{drive.pricing.length} 档会员</Badge>
        </div>
        {drive.highlights.length > 0 && (
          <DriveHighlights
            highlights={drive.highlights.slice(0, 3)}
            variant="compact"
          />
        )}
        <Link
          href={`/compare?ids=${drive.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          加入对比
          <ArrowRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
