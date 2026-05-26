import { DRIVES } from "./drives";
import { FEATURES } from "./features";
import { SCENARIOS } from "./scenarios";
import {
  DriveSchema,
  FeatureMetaSchema,
  ScenarioSchema,
} from "./schema";
import { getDriveFeature } from "@/lib/compare";
import {
  minMonthlyFromPlans,
  minYearlyFromPlans,
} from "@/lib/pricing";
import type { FeatureKey, TierIndex } from "./types";

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

    if (drive.freeStorageGb !== drive.features.freeStorageGb) {
      throw new Error(
        `Drive "${drive.id}": freeStorageGb (${drive.freeStorageGb}) does not match features.freeStorageGb (${drive.features.freeStorageGb})`
      );
    }

    const tierIndices = drive.pricing.map((p) => p.tierIndex).sort();
    const uniqueTiers = new Set(tierIndices);
    if (uniqueTiers.size !== tierIndices.length) {
      throw new Error(
        `Drive "${drive.id}": duplicate tierIndex in pricing`
      );
    }
    for (let i = 0; i < tierIndices.length; i++) {
      const expected = (i + 1) as TierIndex;
      if (tierIndices[i] !== expected) {
        throw new Error(
          `Drive "${drive.id}": tierIndex must be consecutive from 1, got [${tierIndices.join(", ")}]`
        );
      }
    }

    const minMonthly = minMonthlyFromPlans(drive.pricing);
    const minYearly = minYearlyFromPlans(drive.pricing);
    const featureMonthly = drive.features.minMonthlyPrice as number;
    const featureYearly = drive.features.minYearlyPrice as number;

    if (minMonthly !== undefined) {
      if (featureMonthly !== minMonthly) {
        throw new Error(
          `Drive "${drive.id}": minMonthlyPrice (${featureMonthly}) !== min of pricing (${minMonthly})`
        );
      }
    } else if (featureMonthly !== 0) {
      throw new Error(
        `Drive "${drive.id}": no monthly pricing but minMonthlyPrice is ${featureMonthly} (expected 0)`
      );
    }

    if (minYearly !== undefined) {
      if (featureYearly !== minYearly) {
        throw new Error(
          `Drive "${drive.id}": minYearlyPrice (${featureYearly}) !== min of pricing (${minYearly})`
        );
      }
    }

    const highlightIds = new Set<string>();
    for (const h of drive.highlights) {
      if (highlightIds.has(h.id)) {
        throw new Error(
          `Drive "${drive.id}": duplicate highlight id "${h.id}"`
        );
      }
      highlightIds.add(h.id);
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
