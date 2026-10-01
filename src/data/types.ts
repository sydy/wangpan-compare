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

/** 会员计费周期。多年套餐的 priceYearly 是整段总价，不是 1 年标价 */
export type BillingPeriod = "month" | "year" | "multi_year";

/** membership 参与档位对齐；storage_addon 只在详情页单独列出 */
export type PlanKind = "membership" | "storage_addon";

export interface DrivePlan {
  name: string;
  /** 档位序号，用于跨产品对齐对比 */
  tierIndex: TierIndex;
  priceMonthly?: number;
  /** 年付标价；billingPeriod 为 multi_year 时表示整段总价 */
  priceYearly?: number;
  storageGb: number;
  notes?: string;
  /** 官网原始套餐名（默认可与 name 相同） */
  officialName?: string;
  /** 该档位价格来源页 */
  sourceUrl?: string;
  /** 该档位核对日期 YYYY-MM-DD */
  verifiedAt?: string;
  billingPeriod?: BillingPeriod;
  /** 合约年数。多年套餐必填且大于 1 */
  durationYears?: number;
  kind?: PlanKind;
}

/** 免费 / 各会员档的单文件上限，避免只用一个数字代表全部档位 */
export interface FileSizeLimit {
  label: string;
  maxGb: number;
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

/** 特色功能分类（用于分组展示，非通用对比矩阵项） */
export type HighlightCategory = "dev" | "share" | "media" | "sync" | "other";

/** 特色功能所需会员档位 */
export type HighlightTier = "free" | "vip";

export interface DriveHighlight {
  id: string;
  label: string;
  description?: string;
  category: HighlightCategory;
  /** 默认 free；vip 表示需付费会员 */
  tier?: HighlightTier;
}

export const HIGHLIGHT_CATEGORY_LABELS: Record<HighlightCategory, string> = {
  dev: "开发 / 挂载",
  share: "分享 / 协作",
  media: "影音 / 下载",
  sync: "同步 / 备份",
  other: "其他",
};

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
  /** 对比矩阵使用的单文件上限，取已核对档位中的最高值 */
  maxFileSizeGb?: number;
  /** 分档单文件上限；有则详情页展示，且最高值必须等于 maxFileSizeGb */
  fileSizeLimits?: FileSizeLimit[];
  /** 容量口径说明，例如标准空间与专业空间 */
  storageNote?: string;
  speedLimit: SpeedLimit;
  pricing: DrivePlan[];
  /** 容量加购等，不进入会员档位对齐 */
  addons?: DrivePlan[];
  features: Record<FeatureKey, boolean | string | number>;
  clients: DriveClients;
  /** 差异化特色能力（不适合放入通用功能矩阵） */
  highlights: DriveHighlight[];
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
