# 🌐 IP Intelligence Hub (IP 智能检测分析平台)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.20-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

一个基于 **Next.js 15 (App Router)**、**React 19** 与 **Tailwind CSS** 构建的现代、高颜值 IP 智能检测与风险评估平台。视觉设计灵感源于 Apple、Vercel 与 Linear，秉承大面积留白、细细的边框与优雅的主题过渡。

---

## ✨ 核心特性 (Key Features)

### 🎨 极简美学设计 (Minimalist & Premium UI)
*   **双色主题切换**：支持 ☀️ 浅色 / 🌙 深色模式一键切换。
*   **防白屏闪烁 (FOUC-Free)**：内置预加载脚本拦截，在 React 水化前即时注入 `.dark` 样式类，彻底告别硬刷新时的刺眼白屏。
*   **自适应分享卡片**：支持直接将 IP 报告导出为 PNG 格式分享图。导出的卡片能智能感知网站当前的深浅色主题，自动同步背景色与文字对比度。

### ⚙️ 高性能多源检测引擎 (High-Performance Engine)
*   **并发探针合并**：同时发起对多个高信誉 IP 接口（`ip-api.com`、`ipinfo.io`、`ipapi.co`）的查询。
*   **毫秒级熔断保护**：自适应 `3000ms` 并发超时切断，当外部接口限流（429）或被墙时自动进入优雅降级，保障页面绝对不卡死、不白屏。
*   **三重降级防护**：即便在所有 API 均不可用的极端环境下，系统仍会自动命中预设的数据框架进行平滑补全，确保任意 IP 均能呈现完整页面。
*   **DNS 域名自动解析**：输入框支持直接输入域名（如 `github.com`），服务端会自动解析为 IPv4 地址并进行深度扫描。

### 📊 智能综合研判 (Smart Auditing)
*   **安全纯净度评分 (Purity Score)**：根据代理、VPN、Tor 出口节点、IDC 托管段及反向解析等多重指标进行一票否决式扣分，得出 1-100 的纯净度星级。
*   **AI 可用性矩阵 (AI Availability)**：检测目标 IP 在 ChatGPT、Claude、Gemini、Perplexity 及 Grok 等前沿 AI 服务中的区域准入许可与限制等级。
*   **中国区专属适配**：首页智能探测并展示访问者的本机公网 IP 快捷查询，解决传统跳转死循环问题。页脚处展示 `© 2026 毅白 · YIBAI. · 本站数据仅供参考`。

---

## 🛠️ 技术栈 (Tech Stack)

*   **应用框架**: Next.js 15.5 (App Router, Server Actions)
*   **视图渲染**: React 19
*   **样式方案**: Tailwind CSS, PostCSS
*   **国际化**: `next-intl` (中/英双语，包括下载的卡片文本也完美适配本地化)
*   **动画库**: Framer Motion
*   **图片生成**: `html-to-image` (采用 ESM 动态按需导入，确保 100% 服务端渲染安全)
*   **图标套件**: Lucide React

---

## 📂 项目结构 (Project Structure)

```text
├── app/                       # Next.js 页面与路由
│   └── [locale]/
│       ├── ip/[query]/        # IP/域名分析详情页 (含 loading.tsx 骨架屏与 page.tsx)
│       ├── layout.tsx         # 全局布局 (含防闪烁内联脚本与页脚)
│       └── page.tsx           # 首页大标题与搜索区
├── components/                # UI 组件库
│   ├── dashboard/
│   │   ├── ai-availability.tsx# AI 可用性状态列表
│   │   ├── ip-info-card.tsx   # 地理规格细节
│   │   ├── ip-type-card.tsx   # 网络类型权重
│   │   ├── score-gauge.tsx    # 纯净度仪表盘
│   │   └── screenshot-card.tsx# 分享卡片及 PNG 导出器
│   └── WidgetWrapper.tsx      # 右下角悬浮胶囊小部件
├── context/                   # 状态管理器 (主题上下文)
├── lib/                       # 工具类与数据流
│   ├── providers/             # 多数据源连接器 (ip-api, ipinfo-io, ipapi-co)
│   ├── ai-detector.ts         # AI 覆盖区域检测算法
│   ├── mock-data.ts           # 模拟展示数据 (三大测速 IP 的 Mock 预置)
│   └── purity-scorer.ts       # 风险纯净度评分器
└── next.config.js             # 构建与路由插件配置
```

---

## 🚀 快速开始 (Quick Start)

### 1. 安装依赖 (Install dependencies)
```bash
npm install
```

### 2. 启动本地开发服务器 (Run dev server)
在本地的 `7878` 端口启动热更新服务：
```bash
npm run dev
```
打开浏览器访问 [http://localhost:7878/zh](http://localhost:7878/zh)。

### 3. 构建生产版本 (Build for production)
```bash
npm run build
```

---

## ☁️ 部署到 Vercel (Deployment)

由于本项目已经完成了完美的 `Next.js 15` 生产依赖追踪优化，您只需：
1. 将本项目推送至您的 **GitHub / GitLab** 仓库。
2. 登录 **Vercel 控制台**，点击 `Add New Project` 导入该项目。
3. 无需填写任何环境变量，直接点击 **`Deploy`** 即可在几十秒内完成部署并全球加速访问！

---

## ⚖️ 开源协议 (License)

Based on the [MIT License](LICENSE).
Copyright © 2026 **毅白 · YIBAI**. All rights reserved.  
*本站数据仅供参考 (Data on this site is for reference only).*
