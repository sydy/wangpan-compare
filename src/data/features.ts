import type { FeatureCategory, FeatureKey, FeatureMeta } from "./types";

export const FEATURES: FeatureMeta[] = [
  {
    key: "freeStorageGb",
    label: "免费容量",
    description: "注册即享的基础存储空间（GB）",
    category: "pricing",
    compareType: "number",
    better: "higher",
  },
  {
    key: "minMonthlyPrice",
    label: "最低月费",
    description: "主流会员套餐月付起步价（元）",
    category: "pricing",
    compareType: "number",
    better: "lower",
    numberFormat: "price",
  },
  {
    key: "minYearlyPrice",
    label: "最低年费",
    description: "年付套餐起步价（元）",
    category: "pricing",
    compareType: "number",
    better: "lower",
    numberFormat: "price",
  },
  {
    key: "studentDiscount",
    label: "学生/活动价",
    category: "pricing",
    compareType: "string",
    better: "true",
  },
  {
    key: "maxFileSizeGb",
    label: "单文件上限",
    description: "单次上传文件大小上限（GB）",
    category: "storage",
    compareType: "number",
    better: "higher",
  },
  {
    key: "onlineUnzip",
    label: "在线解压",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "videoOriginal",
    label: "视频原画",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "shareLink",
    label: "分享外链",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "saveFromLink",
    label: "链接转存",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "offlineDownload",
    label: "离线下载",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "syncFolder",
    label: "同步文件夹",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "teamSpace",
    label: "团队空间",
    category: "features",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "clientWeb",
    label: "网页版",
    category: "clients",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "clientWin",
    label: "Windows",
    category: "clients",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "clientMac",
    label: "macOS",
    category: "clients",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "clientIos",
    label: "iOS",
    category: "clients",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "clientAndroid",
    label: "Android",
    category: "clients",
    compareType: "boolean",
    better: "true",
  },
  {
    key: "speedLimitDesc",
    label: "非会员限速",
    category: "experience",
    compareType: "string",
    better: "true",
  },
  {
    key: "hasAds",
    label: "含广告",
    category: "experience",
    compareType: "boolean",
    better: "lower",
  },
  {
    key: "signupEasy",
    label: "注册便捷",
    category: "experience",
    compareType: "boolean",
    better: "true",
  },
];

export function getFeaturesByCategory(
  category: FeatureCategory
): FeatureMeta[] {
  return FEATURES.filter((f) => f.category === category);
}

export function getFeatureMeta(key: FeatureKey): FeatureMeta | undefined {
  return FEATURES.find((f) => f.key === key);
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  "pricing",
  "storage",
  "features",
  "clients",
  "experience",
];
