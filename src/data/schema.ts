import { z } from "zod";
import { FEATURES } from "./features";

const featureKeys = FEATURES.map((f) => f.key) as [
  (typeof FEATURES)[number]["key"],
  ...(typeof FEATURES)[number]["key"][],
];

export const FeatureMetaSchema = z.object({
  key: z.enum(featureKeys),
  label: z.string().min(1),
  description: z.string().optional(),
  category: z.enum([
    "pricing",
    "storage",
    "features",
    "clients",
    "experience",
  ]),
  compareType: z.enum(["boolean", "number", "string"]),
  better: z.enum(["higher", "lower", "true"]),
  numberFormat: z.enum(["storage", "price"]).optional(),
});

export const DrivePlanSchema = z.object({
  name: z.string().min(1),
  priceMonthly: z.number().nonnegative().optional(),
  priceYearly: z.number().nonnegative().optional(),
  storageGb: z.number().nonnegative(),
  notes: z.string().optional(),
});

export const DriveClientsSchema = z.object({
  web: z.boolean(),
  win: z.boolean(),
  mac: z.boolean(),
  ios: z.boolean(),
  android: z.boolean(),
});

const featureValueSchema = z.union([z.boolean(), z.string(), z.number()]);

export const DriveFeaturesSchema = z
  .object(
    Object.fromEntries(featureKeys.map((key) => [key, featureValueSchema])) as {
      [K in (typeof featureKeys)[number]]: typeof featureValueSchema;
    }
  )
  .strict();

export const DriveSchema = z.object({
  id: z.enum([
    "baidu",
    "aliyun",
    "quark",
    "weiyun",
    "115",
    "123",
    "tianyi",
    "xunlei",
  ]),
  name: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string().min(1),
  logo: z.string().startsWith("/logos/"),
  brandColor: z.string(),
  website: z.string().url(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  freeStorageGb: z.number().nonnegative(),
  maxFileSizeGb: z.number().nonnegative().optional(),
  speedLimit: z.enum(["none", "soft", "hard", "vip_only"]),
  pricing: z.array(DrivePlanSchema).min(1),
  features: DriveFeaturesSchema,
  clients: DriveClientsSchema,
  pros: z.array(z.string().min(1)).min(1),
  cons: z.array(z.string().min(1)).min(1),
});

export const ScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  recommendations: z
    .array(
      z.object({
        driveId: z.enum([
          "baidu",
          "aliyun",
          "quark",
          "weiyun",
          "115",
          "123",
          "tianyi",
          "xunlei",
        ]),
        rank: z.number().int().positive(),
        reason: z.string().min(1),
      })
    )
    .min(1),
});
