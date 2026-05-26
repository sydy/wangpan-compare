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

/** 付费档位序号：1=入门，2=进阶，3=最高（按标价从低到高） */
export type TierIndex = 1 | 2 | 3;

export interface DrivePlan {
  name: string;
  /** 档位序号，用于跨产品对齐对比 */
  tierIndex: TierIndex;
  priceMonthly?: number;
  priceYearly?: number;
  storageGb: number;
  notes?: string;
  /** 官网原始套餐名（默认可与 name 相同） */
  officialName?: string;
  /** 该档位价格来源页 */
  sourceUrl?: string;
  /** 该档位核对日期 YYYY-MM-DD */
  verifiedAt?: string;
}

export const TIER_LABELS: Record<TierIndex, string> = {
  1: "入门档",
  2: "进阶档",
  3: "最高档",
};

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
  /** 会员/定价页直达链接 */
  pricingUrl?: string;
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
