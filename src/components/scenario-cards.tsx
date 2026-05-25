import Link from "next/link";
import {
  Play,
  HardDrive,
  Share2,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { SCENARIOS } from "@/data/scenarios";
import { getDriveById } from "@/data/drives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriveLogo } from "@/components/drive-logo";

const ICONS: Record<string, LucideIcon> = {
  Play,
  HardDrive,
  Share2,
  Briefcase,
};

export function ScenarioCards({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "grid gap-4 sm:grid-cols-2"
          : "grid gap-6 sm:grid-cols-2"
      }
    >
      {SCENARIOS.map((scenario) => {
        const Icon = ICONS[scenario.icon] ?? Play;
        return (
          <Card key={scenario.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <CardTitle className="text-base">{scenario.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {scenario.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenario.recommendations.map((rec) => {
                const drive = getDriveById(rec.driveId);
                if (!drive) return null;
                return (
                  <div
                    key={rec.driveId}
                    className="flex gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <span className="text-xs font-bold text-primary mt-1">
                      #{rec.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <DriveLogo src={drive.logo} name={drive.name} size="sm" />
                        <span className="font-medium text-sm">{drive.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
              {!compact && (
                <Link
                  href="/scenarios"
                  className="text-sm text-primary hover:underline"
                >
                  查看全部场景 →
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
