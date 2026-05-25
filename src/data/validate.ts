import { DRIVES } from "./drives";
import { FEATURES } from "./features";
import { SCENARIOS } from "./scenarios";
import {
  DriveSchema,
  FeatureMetaSchema,
  ScenarioSchema,
} from "./schema";
import { getDriveFeature } from "@/lib/compare";
import type { FeatureKey } from "./types";

export function validateAllData(): void {
  for (const meta of FEATURES) {
    FeatureMetaSchema.parse(meta);
  }

  const driveIds = new Set<string>();

  for (const drive of DRIVES) {
    DriveSchema.parse(drive);
    driveIds.add(drive.id);

    for (const key of FEATURES.map((f) => f.key)) {
      const value = getDriveFeature(drive, key as FeatureKey);
      if (value === undefined) {
        throw new Error(
          `Drive "${drive.id}" missing feature value for key "${key}"`
        );
      }
    }

    const clientFeatureMap: Record<
      FeatureKey,
      keyof (typeof drive)["clients"]
    > = {
      clientWeb: "web",
      clientWin: "win",
      clientMac: "mac",
      clientIos: "ios",
      clientAndroid: "android",
    } as Record<FeatureKey, keyof (typeof drive)["clients"]>;

    for (const [featureKey, clientKey] of Object.entries(clientFeatureMap)) {
      const fromFeature = drive.features[featureKey as FeatureKey];
      if (drive.clients[clientKey] !== fromFeature) {
        throw new Error(
          `Drive "${drive.id}": clients.${clientKey} (${drive.clients[clientKey]}) does not match features.${featureKey} (${fromFeature})`
        );
      }
    }
  }

  for (const scenario of SCENARIOS) {
    ScenarioSchema.parse(scenario);
    for (const rec of scenario.recommendations) {
      if (!driveIds.has(rec.driveId)) {
        throw new Error(
          `Scenario "${scenario.id}" references unknown driveId "${rec.driveId}"`
        );
      }
    }
  }
}
