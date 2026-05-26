import type { DriveId } from "./types";

/** 各网盘官网定价入口与核对说明（维护数据时对照） */
export interface PricingSourceEntry {
  driveId: DriveId;
  name: string;
  pricingUrl: string;
  website: string;
  notes: string[];
  lastReviewed: string;
}

export const PRICING_SOURCES: PricingSourceEntry[] = [
  {
    driveId: "baidu",
    name: "百度网盘",
    website: "https://pan.baidu.com",
    pricingUrl: "https://yun.baidu.com/buy/center",
    lastReviewed: "2026-05-26",
    notes: [
      "标价以 App/网页会员中心为准；连续包月首月价不写入主数据",
      "VIP 约 500GB 空间；超级会员 SVIP 约 5TB",
      "部分特权仅 SVIP 可用，见套餐 notes",
    ],
  },
  {
    driveId: "aliyun",
    name: "阿里云盘",
    website: "https://www.alipan.com",
    pricingUrl: "https://www.alipan.com/drive/vip",
    lastReviewed: "2026-05-26",
    notes: [
      "主域已迁移至 alipan.com（原 aliyundrive.com 跳转）",
      "超级会员标称 8TB；另有容量加购包，本表仅列主会员档",
      "iOS 连续包年标价可能与网页年付不同",
    ],
  },
  {
    driveId: "quark",
    name: "夸克网盘",
    website: "https://pan.quark.cn",
    pricingUrl: "https://pan.quark.cn",
    lastReviewed: "2026-05-26",
    notes: [
      "会员入口在客户端内；超级会员与 Z 会员权益不同",
      "免费容量以账号实际显示为准",
    ],
  },
  {
    driveId: "weiyun",
    name: "腾讯微云",
    website: "https://www.weiyun.com",
    pricingUrl: "https://www.weiyun.com/vip",
    lastReviewed: "2026-05-26",
    notes: ["VIP/SVIP 容量与价格在会员页查看", "活动价见 notes，不写入标价"],
  },
  {
    driveId: "115",
    name: "115网盘",
    website: "https://115.com",
    pricingUrl: "https://115.com/?ct=info&ac=vip",
    lastReviewed: "2026-05-26",
    notes: [
      "主要为年付 VIP；无官方月付标价",
      "长期 VIP 为多年套餐，折算见 notes",
    ],
  },
  {
    driveId: "123",
    name: "123云盘",
    website: "https://www.123pan.com",
    pricingUrl: "https://www.123pan.com/vip",
    lastReviewed: "2026-05-26",
    notes: [
      "2026-01-01 起部分商品调价，以官网公告为准",
      "VIP 年付 App Store 标价约 ¥180；超级会员连续包月约 ¥80",
      "免费 2TB 与下载流量政策变动频繁",
    ],
  },
  {
    driveId: "tianyi",
    name: "天翼云盘",
    website: "https://cloud.189.cn",
    pricingUrl: "https://cloud.189.cn/web/vip",
    lastReviewed: "2026-05-26",
    notes: ["黄金/铂金会员；融合套餐价不在此表", "单文件上限以客户端为准"],
  },
  {
    driveId: "xunlei",
    name: "迅雷云盘",
    website: "https://pan.xunlei.com",
    pricingUrl: "https://pay.xunlei.com",
    lastReviewed: "2026-05-26",
    notes: [
      "云盘权益多与迅雷超级会员捆绑",
      "空间标称约 6TB，以会员页为准",
    ],
  },
];

export function getPricingSource(driveId: DriveId): PricingSourceEntry | undefined {
  return PRICING_SOURCES.find((s) => s.driveId === driveId);
}
