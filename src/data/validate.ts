import { DRIVES } from "./drives";
import { FEATURES } from "./features";
import { PRICING_SOURCES } from "./pricing-sources";
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

const STALE_DAYS = 60;

function ageInDays(isoDate: string): number {
  const then = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(then)) {
    throw new Error(`Invalid date "${isoDate}"`);
  }
  return (Date.now() - then) / (24 * 60 * 60 * 1000);
}

function assertFresh(isoDate: string, label: string): void {
  const age = ageInDays(isoDate);
  if (age > STALE_DAYS) {
    throw new Error(
      `${label} is stale (${isoDate}, ${Math.floor(age)} days; limit ${STALE_DAYS})`
    );
  }
}

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

    if (
      drive.maxFileSizeGb !== undefined &&
      drive.maxFileSizeGb !== drive.features.maxFileSizeGb
    ) {
      throw new Error(
        `Drive "${drive.id}": maxFileSizeGb (${drive.maxFileSizeGb}) does not match features.maxFileSizeGb (${drive.features.maxFileSizeGb})`
      );
    }

    if (drive.fileSizeLimits && drive.fileSizeLimits.length > 0) {
      const highest = Math.max(...drive.fileSizeLimits.map((l) => l.maxGb));
      if (drive.maxFileSizeGb !== highest) {
        throw new Error(
          `Drive "${drive.id}": maxFileSizeGb (${drive.maxFileSizeGb}) must equal the highest fileSizeLimits value (${highest})`
        );
      }
    }

    assertFresh(drive.updatedAt, `Drive "${drive.id}" updatedAt`);

    const plans = [...drive.pricing, ...(drive.addons ?? [])];
    for (const plan of plans) {
      if (!plan.sourceUrl) {
        throw new Error(`Drive "${drive.id}" plan "${plan.name}" missing sourceUrl`);
      }
      if (!plan.verifiedAt) {
        throw new Error(`Drive "${drive.id}" plan "${plan.name}" missing verifiedAt`);
      }
      assertFresh(
        plan.verifiedAt,
        `Drive "${drive.id}" plan "${plan.name}" verifiedAt`
      );
    }

    for (const plan of drive.pricing) {
      if (plan.kind === "storage_addon") {
        throw new Error(
          `Drive "${drive.id}" plan "${plan.name}" is a storage addon and must not sit in pricing tiers`
        );
      }
    }
    for (const addon of drive.addons ?? []) {
      if (addon.kind !== "storage_addon") {
        throw new Error(
          `Drive "${drive.id}" addon "${addon.name}" must set kind to storage_addon`
        );
      }
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

    const source = PRICING_SOURCES.find((s) => s.driveId === drive.id);
    if (!source) {
      throw new Error(`Drive "${drive.id}" has no pricing-sources entry`);
    }
    if (source.pricingUrl !== drive.pricingUrl) {
      throw new Error(
        `Drive "${drive.id}": pricingUrl (${drive.pricingUrl}) !== pricing-sources (${source.pricingUrl})`
      );
    }
    if (source.website !== drive.website) {
      throw new Error(
        `Drive "${drive.id}": website (${drive.website}) !== pricing-sources (${source.website})`
      );
    }
    if (source.lastReviewed !== drive.updatedAt) {
      throw new Error(
        `Drive "${drive.id}": pricing-sources lastReviewed (${source.lastReviewed}) !== updatedAt (${drive.updatedAt})`
      );
    }
    assertFresh(
      source.lastReviewed,
      `pricing-sources "${drive.id}" lastReviewed`
    );
  }

  const sourceIds = PRICING_SOURCES.map((s) => s.driveId);
  if (new Set(sourceIds).size !== sourceIds.length) {
    throw new Error("pricing-sources has duplicate driveId");
  }
  for (const source of PRICING_SOURCES) {
    if (!driveIds.has(source.driveId)) {
      throw new Error(
        `pricing-sources references unknown driveId "${source.driveId}"`
      );
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
