export type DriveId =
  | "baidu"
  | "aliyun"
  | "quark"
  | "weiyun"
  | "115"
  | "123"
  | "tianyi"
  | "xunlei";

export type FeatureCategory =
  | "pricing"
  | "storage"
  | "features"
  | "clients"
  | "experience";

export type FeatureKey =
  | "freeStorageGb"
  | "minMonthlyPrice"
  | "minYearlyPrice"
  | "studentDiscount"
  | "maxFileSizeGb"
  | "onlineUnzip"
  | "videoOriginal"
  | "shareLink"
  | "saveFromLink"
  | "offlineDownload"
  | "syncFolder"
  | "teamSpace"
  | "clientWeb"
  | "clientWin"
  | "clientMac"
  | "clientIos"
  | "clientAndroid"
  | "speedLimitDesc"
  | "hasAds"
  | "signupEasy";

export type SpeedLimit = "none" | "soft" | "hard" | "vip_only";

export type CompareType = "boolean" | "number" | "string";
export type BetterDirection = "higher" | "lower" | "true";
/** 数值型维度的展示单位 */
export type NumberFormat = "storage" | "price";

export interface FeatureMeta {
  key: FeatureKey;
  label: string;
  description?: string;
  category: FeatureCategory;
  compareType: CompareType;
  better: BetterDirection;
  /** compareType 为 number 时生效，默认按容量 GB 显示 */
  numberFormat?: NumberFormat;
}

export interface DrivePlan {
  name: string;
  priceMonthly?: number;
  priceYearly?: number;
  storageGb: number;
  notes?: string;
}

export interface DriveClients {
  web: boolean;
  win: boolean;
  mac: boolean;
  ios: boolean;
  android: boolean;
}

export interface Drive {
  id: DriveId;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  brandColor: string;
  website: string;
  updatedAt: string;
  freeStorageGb: number;
  maxFileSizeGb?: number;
  speedLimit: SpeedLimit;
  pricing: DrivePlan[];
  features: Record<FeatureKey, boolean | string | number>;
  clients: DriveClients;
  pros: string[];
  cons: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  recommendations: {
    driveId: DriveId;
    rank: number;
    reason: string;
  }[];
}

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  pricing: "价格",
  storage: "容量",
  features: "功能",
  clients: "客户端",
  experience: "限速与体验",
};
