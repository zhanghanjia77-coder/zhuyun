# 筑韵（ZhuYun）

筑韵是一款面向 **建筑文化与数字内容** 的 Web 应用方向的产品代号。当前仓库为 **前端骨架 + Supabase 后端约定**：业务页面尚未接入，数据与文件能力统一由 **Supabase**（PostgreSQL、Auth、Storage、Realtime 等）承载，便于快速迭代与上线。

---

## 项目简介

| 维度 | 说明 |
|------|------|
| **定位** | 以「筑」（空间、建造）与「韵」（格调、叙事）为核心，连接内容展示、用户身份与媒体资源。 |
| **现状** | 使用 React + TypeScript + Vite 搭建；`src/lib/supabase.ts` 提供 Supabase 客户端；数据库与存储通过 `supabase/migrations/` 中的 SQL 在远端项目执行。 |
| **目标** | 在保持轻量前端的前提下，将用户资料、业务数据与静态资源全部落在 Supabase，减少自建后端运维成本。 |

---

## 功能模块构成（规划与现状）

以下为 **产品层面的模块划分**。标「已实现」的与仓库当前代码一致；其余为推荐演进顺序，便于排期与分工。

| 模块 | 说明 | 状态 |
|------|------|------|
| **应用壳与路由** | 页面骨架、布局、懒加载与错误边界。 | 待建设 |
| **用户与身份** | 注册/登录、会话维持、与 `auth.users` 绑定的 `profiles`（昵称、头像等）。 | 库表已规划；UI 未接 |
| **个人资料** | 读取/更新 `profiles`，头像可走 Storage 公开桶或受控路径。 | 库表已规划 |
| **内容展示** | 列表/详情（文章、作品、案例等，表结构可按业务再迁移）。 | 待建设 |
| **媒体与资源** | 图片/文件上传至 Storage；公开读、登录用户写策略已在迁移中示例。 | 策略已示例 |
| **互动与扩展** | 评论、收藏、通知等（依赖 Row Level Security 与 Realtime）。 | 待建设 |
| **系统与设置** | 主题、语言、隐私与账号安全入口。 | 待建设 |

**当前仓库已落地的后端侧能力：**

- `profiles` 表：与 `auth.users` 一对一，字段含 `username`、`avatar_url`、`created_at`。
- 存储桶 `zhuyun-assets`：公开读；`authenticated` 角色可写入/更新/删除（见迁移文件）。

---

## 技术路线

### 前端

- **框架**：React 19  
- **语言**：TypeScript 5  
- **构建**：Vite 8  
- **质量**：ESLint 9（`typescript-eslint`、React Hooks 规则）

### 后端与数据（Supabase）

| 能力 | 用途 |
|------|------|
| **Auth** | 用户注册登录、JWT、与 `profiles` 联动 |
| **PostgreSQL** | 业务表、索引、视图；通过 **RLS** 做行级权限 |
| **Storage** | 图片与附件；桶策略与路径规范在迁移与控制台中维护 |
| **Realtime（可选）** | 列表/消息等实时更新 |
| **Edge Functions（可选）** | 复杂校验、Webhook、第三方回调 |

客户端通过 **`@supabase/supabase-js`** 在浏览器中调用（使用 **anon key** + RLS，敏感逻辑放在策略或服务端）。

### 仓库目录（演进参考）

```text
ZhuYunAPP/
├── src/
│   ├── lib/supabase.ts      # Supabase 单例，读取 VITE_* 环境变量
│   ├── App.tsx              # 根组件（当前为 Vite 模板页）
│   └── main.tsx
├── supabase/migrations/     # 可在 Supabase SQL Editor 或 CLI 中执行
│   ├── 00_initial_schema.sql
│   └── 01_storage_lake.sql
├── .env.example             # 环境变量模板（勿提交真实密钥）
└── README.md
```

### 环境变量

复制 `.env.example` 为 `.env` 并填写：

- `VITE_SUPABASE_URL`：项目 URL  
- `VITE_SUPABASE_ANON_KEY`：匿名公钥（仅配合 RLS 使用）

---

## UI 风格（当前实现与设计取向）

当前界面来自 **Vite 官方模板**，但已体现一套可延续的设计语言，后续业务页建议保持一致：

| 方面 | 说明 |
|------|------|
| **色彩** | 浅色默认：中性灰文字 `#6b6375`、标题近黑 `#08060d`、**紫色强调** `#aa3bff`（暗色模式下为高亮紫 `#c084fc`）。 |
| **模式** | `color-scheme: light dark`，随系统主题切换背景与边框（`--bg`、`--border`）。 |
| **字体** | 系统无衬线栈（`system-ui`、`Segoe UI`、`Roboto`）；代码与计数器使用 `ui-monospace` / `Consolas`。 |
| **布局** | 主容器最大宽度约 `1126px`、居中；纵向分区 + 顶部分隔线，偏 **文档/产品落地页** 气质。 |
| **组件气质** | 圆角按钮、细边框、轻阴影 hover；适合扩展为 **简洁、偏内容型** 的筑韵品牌界面。 |

后续若品牌化，建议将紫色阶与中性色提取为设计 Token（CSS 变量或设计稿组件库），并统一卡片、列表与表单间距。

---

## 本地开发

**环境要求**：Node.js 18+，npm 9+。

```bash
npm install
```

（`@supabase/supabase-js` 已在 `package.json` 依赖中；若拉取旧分支后缺失，可执行 `npm install @supabase/supabase-js`。）

将 `.env.example` 复制为 `.env` 并填入 Supabase 项目配置后：

```bash
npm run dev
```

默认开发地址：<http://localhost:5173>。

**常用脚本**：

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | ESLint 检查 |

---

## Supabase 迁移说明

1. 在 Supabase 控制台打开 **SQL Editor**。  
2. 按文件名顺序执行 `supabase/migrations/00_initial_schema.sql`，再执行 `01_storage_lake.sql`。  
3. 若策略已存在导致冲突，请按控制台提示调整或先删除旧策略再执行。

也可在本地安装 [Supabase CLI](https://supabase.com/docs/guides/cli) 后，用 `supabase db push` 等方式管理（需自行维护 `config.toml` 与链接）。

---

## 安全与协作提示

- **切勿**将 `.env` 或含真实密钥的文件提交到公开仓库；泄露后请在 Supabase 控制台 **轮换** anon/service 密钥。  
- 生产环境务必为每张业务表配置 **RLS**，匿名 key 仅配合策略使用。  
- 当前 `App.tsx` 仍为模板页；引入 `hero.png` 等静态资源时请保证路径存在，否则构建会失败。

---

## 文档版本

- 与仓库代码同步说明：**2026-04**  
- 后端数据层：**Supabase**（PostgreSQL + Auth + Storage）
