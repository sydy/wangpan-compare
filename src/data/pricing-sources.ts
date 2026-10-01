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
    lastReviewed: "2026-10-01",
    notes: [
      "会员中心需登录，2026-10-01 未能打开结算页，年月标价未改",
      "帮助中心（pan.baidu.com/disk/help）：免费网页 1GB、免费客户端 4GB、VIP 10GB、SVIP 20GB",
    ],
  },
  {
    driveId: "aliyun",
    name: "阿里云盘",
    website: "https://www.alipan.com",
    pricingUrl: "https://www.alipan.com/drive/vip",
    lastReviewed: "2026-10-01",
    notes: [
      "会员页是登录后的单页，当日未能读取结算价",
      "超级会员单独作为会员档；容量加购放在 addons，不参与档位对齐",
    ],
  },
  {
    driveId: "quark",
    name: "夸克网盘",
    website: "https://pan.quark.cn",
    pricingUrl: "https://pan.quark.cn/",
    lastReviewed: "2026-10-01",
    notes: [
      "公开站没有独立价目页，收银台在客户端内",
      "年卡官方定价 ¥300；日常大促约 ¥25/月、¥158/年（IT之家 2026-02-22、2026-05-18）",
      "15/168 与 Z 会员未作为标价保留",
    ],
  },
  {
    driveId: "weiyun",
    name: "腾讯微云",
    website: "https://www.weiyun.com",
    pricingUrl: "https://www.weiyun.com/vip",
    lastReviewed: "2026-10-01",
    notes: [
      "会员页需登录，当日未看到完整年月价目，标价未改",
      "特权页有 ¥30/月入口，容量数字像账号数据，未采信",
    ],
  },
  {
    driveId: "115",
    name: "115网盘",
    website: "https://115.com",
    pricingUrl: "https://vip.115.com/",
    lastReviewed: "2026-10-01",
    notes: [
      "连续包月 ¥98，见 vip.115.com 商品接口",
      "年费 ¥500 赠 15TB 依据 2026-05-29 权益调整；当日货架未返回该 SKU",
      "8 年 40TB 标价 ¥1150（2026-05-01 公告），按 8 年折算，不把总价当成 1 年",
    ],
  },
  {
    driveId: "123",
    name: "123云盘",
    website: "https://www.123pan.com",
    pricingUrl: "https://www.123pan.com/vipcenter/",
    lastReviewed: "2026-10-01",
    notes: [
      "2026-09-24 公告：标准空间与专业空间分计，老用户免费为专业 50GB + 标准 2TB",
      "会员专业空间配额二级报道为 VIP 约 1TB、SVIP 约 2TB；首页仍写 20TB / 100TB",
      "2026-01-01 调价公告未给出新标价，会员中心有验证，年月价格未改",
    ],
  },
  {
    driveId: "tianyi",
    name: "天翼云盘",
    website: "https://cloud.189.cn",
    pricingUrl: "https://cloud.189.cn/web/vip",
    lastReviewed: "2026-10-01",
    notes: [
      "下载页列出 macOS 10.10 及以上客户端：https://cloud.189.cn/download_client.jsp",
      "订阅标价取 App Store 应用说明中的连续包月/包年，不是首月价",
    ],
  },
  {
    driveId: "xunlei",
    name: "迅雷云盘",
    website: "https://pan.xunlei.com",
    pricingUrl: "https://vip.xunlei.com/vip_service/supervip/",
    lastReviewed: "2026-10-01",
    notes: [
      "超级会员页同时显示 ¥30/月与原价 ¥45/月，本表取原价",
      "年费与云盘容量当日页面未列出",
    ],
  },
];

export function getPricingSource(driveId: DriveId): PricingSourceEntry | undefined {
  return PRICING_SOURCES.find((s) => s.driveId === driveId);
}
