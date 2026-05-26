# 网盘横评

国内主流网盘一站式对比（含 123 云盘）：价格、容量、限速、功能矩阵与场景推荐。

## 功能

- 首页快速勾选最多 4 款网盘进入对比
- `/compare` 分类对比表，支持差异高亮与 URL 分享（`?ids=baidu,aliyun,quark`）
- `/drive/[id]` 单产品详情（套餐、功能、优缺点）
- `/scenarios` 按看视频、备份、分享、办公等场景推荐

## 开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 更新对比数据

1. 对照各平台官网会员/定价页，在 [`src/data/drives.ts`](src/data/drives.ts) 中更新 `pricing`（含 `tierIndex`、`sourceUrl`、`verifiedAt`）及 `features` 聚合字段
2. 官网入口与核对说明见 [`src/data/pricing-sources.ts`](src/data/pricing-sources.ts)
3. 新功能维度在 [`src/data/types.ts`](src/data/types.ts) 的 `FeatureKey` 与 [`src/data/features.ts`](src/data/features.ts) 中注册
4. 场景推荐编辑 [`src/data/scenarios.ts`](src/data/scenarios.ts)
5. Logo：运行 `python3 scripts/download-logos.py` 从 App Store 拉取 512px 官方应用图标（见 [`public/logos/SOURCES.md`](public/logos/SOURCES.md)）

数据一致性校验：

```bash
npm run validate:data
```

修改后执行 `npm run build` 确认无类型错误。对比页「会员套餐」Tab 支持按档位对齐与完整套餐列表两种视图。

## 部署

支持 Vercel、Cloudflare Pages 等。生产环境请配置站点 URL（用于 sitemap、Open Graph、JSON-LD）：

```env
NEXT_PUBLIC_SITE_URL=https://你的域名
```

可参考 [`.env.example`](.env.example)。构建前会自动检查 Logo 文件与数据一致性（`npm run check:logos`、`npm run validate:data`）。

## 免责声明

价格与功能以各平台官网为准，本站仅供参考，不构成购买建议。
