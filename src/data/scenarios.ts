import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "video",
    title: "看视频",
    description: "在线播放流畅、支持原画与投屏",
    icon: "Play",
    recommendations: [
      {
        driveId: "quark",
        rank: 1,
        reason: "免费用户视频体验较好，广告相对较少，原画播放支持完善",
      },
      {
        driveId: "aliyun",
        rank: 2,
        reason: "播放稳定、界面简洁，会员后几乎不限速",
      },
    ],
  },
  {
    id: "backup",
    title: "大文件备份",
    description: "容量大、单文件上限高、长期存储",
    icon: "HardDrive",
    recommendations: [
      {
        driveId: "115",
        rank: 1,
        reason: "大容量套餐性价比高，适合海量资源归档",
      },
      {
        driveId: "baidu",
        rank: 2,
        reason: "生态成熟、资源分享丰富，适合综合备份",
      },
    ],
  },
  {
    id: "large-free",
    title: "要大空间",
    description: "注册即享 TB 级免费容量，适合囤资源",
    icon: "HardDrive",
    recommendations: [
      {
        driveId: "123",
        rank: 1,
        reason: "注册即享约 2TB 免费空间，标称上传下载不限速",
      },
      {
        driveId: "aliyun",
        rank: 2,
        reason: "100GB 免费且体验均衡，会员后容量可扩至 TB 级",
      },
    ],
  },
  {
    id: "share",
    title: "分享转存",
    description: "外链分享、他人资源一键保存",
    icon: "Share2",
    recommendations: [
      {
        driveId: "baidu",
        rank: 1,
        reason: "用户基数最大，分享链接与转存生态最完善",
      },
      {
        driveId: "quark",
        rank: 2,
        reason: "转存速度快，分享页面体验现代",
      },
    ],
  },
  {
    id: "office",
    title: "办公协作",
    description: "文档同步、多端协作、团队空间",
    icon: "Briefcase",
    recommendations: [
      {
        driveId: "aliyun",
        rank: 1,
        reason: "同步盘稳定、与钉钉生态打通，适合办公",
      },
      {
        driveId: "tianyi",
        rank: 2,
        reason: "运营商背书、家庭套餐实惠，适合政企与家庭",
      },
    ],
  },
];
