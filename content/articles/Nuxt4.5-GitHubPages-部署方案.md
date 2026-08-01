---
title: Nuxt 4.5 部署 GitHub Pages 完整方案：从零到上线的踩坑指南
date: 2026-08-02
category: Nuxt 4
tags: [Nuxt 4, GitHub Pages, 部署, CI/CD, 前端工程]
description: 针对 Nuxt 4.5.x 版本的完整 GitHub Pages 部署教程，涵盖版本要求、baseURL 配置、Actions 工作流、多环境变量，以及 8 个高频踩坑问题的排查与修复方案。
---

# Nuxt 4.5 部署 GitHub Pages 完整方案

> **适用版本**：Nuxt ^4.5.1 | **部署模式**：静态站点生成 (SSG) | **包管理器**：npm
> **更新日期**：2026-08-02

---

## 目录

- [一、前置条件与版本要求](#一前置条件与版本要求)
- [二、项目核心配置](#二项目核心配置)
  - [2.1 nuxt.config.ts 关键配置](#21-nuxtconfigts-关键配置)
  - [2.2 package.json 脚本配置](#22-packagejson-脚本配置)
  - [2.3 多环境变量配置 (.env.github)](#23-多环境变量配置-envgithub)
- [三、GitHub Pages 仓库设置](#三github-pages-仓库设置)
- [四、GitHub Actions 工作流配置](#四github-actions-工作流配置)
- [五、部署触发与验证流程](#五部署触发与验证流程)
- [六、常见问题排查手册](#六常见问题排查手册)
- [七、本地模拟部署验证](#七本地模拟部署验证)
- [八、附录：配置文件完整清单](#八附录配置文件完整清单)

---

## 一、前置条件与版本要求

### 1.1 硬性版本要求

Nuxt 4.5.x 对运行环境有严格的版本约束，**本地与 CI 环境必须同时满足**：

| 依赖项 | 最低要求 | 本项目实际使用 | 说明 |
|--------|----------|----------------|------|
| Node.js | >= 22.18.0 | 24.x | Nuxt 4 引擎要求，低于此版本构建时会出现 `EBADENGINE` 警告或运行时崩溃 |
| npm | >= 10.x | 随 Node 24 自带 | 包管理器，本项目使用 npm (存在 `package-lock.json`) |
| Vue | ^3.5.x | ^3.5.40 | Nuxt 4 内置 Vue 3 |

### 1.2 本地环境检查

部署前请在终端确认版本：

```bash
node -v   # 应输出 v22.x 或 v24.x
npm -v    # 应输出 10.x 或更高
```

---

## 二、项目核心配置

### 2.1 nuxt.config.ts 关键配置

GitHub Pages 部署的核心在于 **baseURL** 和 **静态生成配置**。以下是必须正确设置的字段：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ──────────────────────────────────────────────
  // 1. 基础路径（GitHub Pages 部署最容易写错的配置）
  //    ⚠️  分两种情况，千万不能搞混！
  //
  //    情况 A：仓库名是 <username>.github.io（用户/组织级站点）
  //           → 最终 URL：https://<username>.github.io/
  //           → 正确配置：baseURL: "/"  或不设置（默认就是 /）
  //           → ❌ 绝对不能写成 "/<username>.github.io/"！否则路径双层嵌套
  //
  //    情况 B：普通仓库，如 <username>/my-blog（项目级站点）
  //           → 最终 URL：https://<username>.github.io/my-blog/
  //           → 正确配置：baseURL: "/my-blog/"
  //
  //    本项目属于情况 A（wsgtop.github.io），所以配 "/"
  // ──────────────────────────────────────────────
  app: {
    baseURL: "/",  // ✅ 用户级 Pages 站点，根路径，无任何前缀
    // ... 其他 head 配置
  },

  // ──────────────────────────────────────────────
  // 2. 运行时配置（通过环境变量覆盖，避免硬编码）
  //    命名规则：NUXT_PUBLIC_<KEY> 对应 runtimeConfig.public.<key in camelCase>
  // ──────────────────────────────────────────────
  runtimeConfig: {
    public: {
      apiBase: "",  // 留空，由 .env.github 的 NUXT_PUBLIC_API_BASE 覆盖
    },
  },

  // ──────────────────────────────────────────────
  // 3. Nitro 预渲染配置（SSG 静态生成必须）
  //    crawlLinks: true → 从首页自动爬取所有链接生成 HTML + payload
  //                     → 避免刷新文章页 404，同时 payload 按页精确生成
  // ──────────────────────────────────────────────
  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },

  // ──────────────────────────────────────────────
  // 4. Vite 构建优化（代码压缩 + Chunk 合并，提升首屏性能）
  //
  //    关于 Gzip/Brotli 压缩的澄清：
  //    GitHub Pages 通过 Fastly CDN 自动做传输层 Gzip 压缩，
  //    不需要手动生成 .gz / .br 文件（上传了也不会自动加 Content-Encoding）。
  //    但构建端的代码压缩必须开——它让源文件本身更小，与 CDN 压缩是叠加关系。
  //
  //    只在 environments.client 中配置，避免破坏 Nitro SSR 侧的样式占位符解析。
  // ──────────────────────────────────────────────
  vite: {
    environments: {
      client: {
        build: {
          // terser 压缩率比默认 esbuild 高 5-10%，构建慢 1.5x 左右
          // 部署是 CI 自动跑，多花 10 秒换用户少加载 5-10KB 很值
          minify: "terser",
          terserOptions: {
            compress: {
              drop_console: true,   // 生产环境移除 console.log
              drop_debugger: true,  // 移除 debugger 语句
              passes: 2,            // 两轮压缩（更高压缩率）
            },
          },
          sourcemap: false,        // 不生成 .map（防源码泄露 + 省体积）

          // Chunk 合并：按"稳定程度"分块，最大化浏览器缓存命中率
          //   框架核心（几年不更）→ core-vendor，长期缓存
          //   博客生态依赖（月更）→ content-vendor
          //   业务页面（日常更）→ Nuxt 默认按路由拆
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (
                  id.includes("node_modules/vue/") ||
                  id.includes("node_modules/@vue/") ||
                  id.includes("node_modules/vue-router/") ||
                  id.includes("node_modules/nuxt/") ||
                  id.includes("node_modules/h3/") ||
                  id.includes("node_modules/nitropack/")
                ) {
                  return "core-vendor";
                }
                if (
                  id.includes("node_modules/@nuxt/content/") ||
                  id.includes("node_modules/@nuxtjs/tailwindcss/") ||
                  id.includes("node_modules/tailwindcss/") ||
                  id.includes("node_modules/@nuxt/icon/") ||
                  id.includes("node_modules/@iconify/")
                ) {
                  return "content-vendor";
                }
              },
            },
          },
        },
      },
    },
  },
});
```

**⚠️ baseURL 注意事项（GitHub Pages 类型判断口诀）**：

> 一看仓库名结尾：是不是 `<username>.github.io`？
> - **是 → 用户/组织级站点** → `baseURL: "/"` 或不写
> - **不是 → 项目级站点** → `baseURL: "/<仓库名>/"`

- **开头和结尾都必须有斜杠**（项目级场景），否则静态资源路径会拼接错误
- 本项目仓库名是 `wsgtop.github.io`，**用户级站点**，所以 `baseURL` 必须是 `"/"`
- 常见反例：用户级站点错误地写成 `"/wsgtop.github.io/"` → 会导致 URL 双层嵌套 `https://xxx.github.io/wsgtop.github.io/_nuxt/...`，所有资源 404 并报 MIME type 错误（就是本次部署遇到的问题）
- 如果你的仓库是普通仓库（如 `my-blog`），URL 是 `https://user.github.io/my-blog/`，则 baseURL 应为 `"/my-blog/"`

### 2.2 package.json 脚本配置

关键原则：**所有调用 Nuxt CLI 的命令必须通过 `npm run` 间接触发**，不能在 CI 中直接裸写 `nuxt generate`，否则会报 `command not found`。

```jsonc
// package.json
{
  "scripts": {
    // 本地开发
    "dev": "nuxt dev",
    "start": "nuxt dev",

    // 通用构建（默认环境）
    "build": "node script/build-search-index.js && nuxt build",
    "generate": "node script/build-search-index.js && nuxt generate",

    // ──────────────────────────────────────────────
    // ✅ GitHub Pages 专用构建脚本
    //    --dotenv .env.github 指定加载 GitHub 环境变量
    //    构建前先运行自定义脚本 build-search-index.js 生成搜索索引
    // ──────────────────────────────────────────────
    "generate:github": "node script/build-search-index.js && nuxt generate --dotenv .env.github",

    // 本地预览构建产物
    "preview": "nuxt preview",

    // Nuxt 首次安装时自动生成类型声明
    "postinstall": "nuxt prepare",

    // 清理缓存（遇到 EPERM/构建缓存问题时执行）
    "clean": "node -e \"const fs=require('fs');const path=require('path');const rm=p=>{if(fs.existsSync(p)){fs.rmSync(p,{recursive:true,force:true});console.log('Removed:',p)}};['.nuxt','.output','.data','.nitro',path.join('node_modules','.cache','nuxt')].forEach(rm)\""
  }
}
```

### 2.3 多环境变量配置 (.env.github)

在项目根目录创建 `.env.github` 文件，存放 GitHub Pages 环境的专属配置：

```bash
# .env.github
#
# 命名规则：NUXT_PUBLIC_<KEY_NAME_IN_SNAKE_CASE>
# 会自动映射到 nuxt.config.ts 的 runtimeConfig.public.<keyNameInCamelCase>
#
# 例如：NUXT_PUBLIC_API_BASE → runtimeConfig.public.apiBase

# GitHub Pages 部署的公开 API/资源基地址
NUXT_PUBLIC_API_BASE=https://wsgtop.github.io/
```

**为什么需要单独的 .env.github？**
- 本地开发 `.env` 可能使用 `http://localhost:3000` 或内网地址
- GitHub Pages 部署必须使用正式的公网 URL
- 通过 `--dotenv` 参数切换环境，避免硬编码或手动修改

---

## 三、GitHub Pages 仓库设置

### 3.1 切换部署源到 GitHub Actions

**这是部署成功的第一步，也是最容易出错的一步**。

1. 进入 GitHub 仓库页面：`https://github.com/<username>/<repo>`
2. 点击顶部 **Settings** 标签
3. 左侧菜单找到 **Pages**（在 *Code and automation* 分类下）
4. 在 **Build and deployment → Source** 下拉框中：
   - ❌ **不要** 选择 `Deploy from a branch`（该模式直接读分支文件，不会执行 Nuxt 构建）
   - ✅ **必须** 选择 `GitHub Actions`

完成后，Settings → Pages 页面应显示：
> **GitHub Actions**
> *Use a GitHub Actions workflow to deploy to Pages. Learn more.*

### 3.2 确认仓库可见性与 Pages 权限

- 如果仓库是 **Public**：无需额外设置，Pages 默认启用
- 如果仓库是 **Private**：需要在 Settings → Pages 中确认 Pages 已启用
- 免费账号的 Private 仓库无法使用自定义域名，但可使用 `*.github.io` 子域名

---

## 四、GitHub Actions 工作流配置

### 4.1 创建工作流文件

在项目根目录创建文件 `.github/workflows/deploy.yml`（路径和文件名必须完全正确，且需要推送到远端）：

```yaml
name: Deploy Nuxt to GitHub Pages

# ──────────────────────────────────────────────
# 触发条件：推送到指定分支时自动运行
# 如果你的主分支名不同，修改 branches 数组即可
# ──────────────────────────────────────────────
on:
  push:
    branches: ["nuxt-blog"]

jobs:
  # ============================================================
  # 构建 Job：安装依赖 → 生成静态站点 → 上传产物
  # ============================================================
  build:
    runs-on: ubuntu-latest
    steps:
      # 步骤 1：拉取代码
      - uses: actions/checkout@v4

      # ──────────────────────────────────────────────
      # 步骤 2：设置 Node.js 环境
      # ⚠️  版本必须 >= 22，与本地保持一致推荐 24
      # ⚠️  cache: "npm" 需要仓库存在 package-lock.json
      #     如果没有 lockfile，删除 cache 这一行
      # ──────────────────────────────────────────────
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "npm"   # 可选，加速依赖安装；移除不影响正确性

      # 步骤 3：安装依赖
      - run: npm install

      # ──────────────────────────────────────────────
      # 步骤 4：构建静态站点（核心步骤）
      # ✅  通过 npm run 调用脚本，避免 command not found
      # ✅  使用专门的 generate:github 脚本加载正确环境变量
      # ──────────────────────────────────────────────
      - run: npm run generate:github

      # ──────────────────────────────────────────────
      # 步骤 5：上传构建产物
      # ⚠️  Nuxt 4 generate 的静态产物输出在 ./.output/public（不是 dist！）
      #     错误地写 ./dist 会导致上传空目录 → Pages 重新 fallback 到 README
      # ──────────────────────────────────────────────
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public

  # ============================================================
  # 部署 Job：等待构建成功 → 将产物发布到 GitHub Pages
  # ============================================================
  deploy:
    # 依赖构建 Job 成功后才会执行
    needs: build

    # ──────────────────────────────────────────────
    # 部署所需的最小权限集合
    # 如果未声明，deploy-pages 会因权限不足失败
    # ──────────────────────────────────────────────
    permissions:
      pages: write       # 写入 Pages 产物
      id-token: write    # 用于 Pages 身份验证

    # 标记部署环境，GitHub 会在仓库首页显示部署状态
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    steps:
      # 官方 Pages 部署 Action，自动处理所有发布逻辑
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4.2 工作流关键注意事项

| 配置项 | 正确做法 | 常见错误 |
|--------|----------|----------|
| `node-version` | `"24"` 或 `"22"` | 使用 `"20"` 或 `"18"`（Nuxt 4 不兼容） |
| 构建命令 | `npm run generate:github` | 裸写 `nuxt generate`（报 `command not found`） |
| `upload-pages-artifact` 的 path | `./.output/public` (Nuxt 4) | 写 `./dist`（不存在，上传空目录导致显示 README） |
| `permissions` | 在 deploy job 中声明 `pages` 和 `id-token` 为 write | 未声明或放在 build job 中 |
| `branches` 触发 | 与实际推送的分支名完全一致（大小写敏感） | 本地分支名是 `main`，YAML 写了 `master` |
| `cache: "npm"` | 仓库需有 `package-lock.json` | 只有 `pnpm-lock.yaml` 却用 `cache: "npm"` |

---

## 五、部署触发与验证流程

### 5.1 自动部署（推荐）

完成上述配置后，只需：

```bash
# 1. 提交所有变更（包括 .github/workflows/deploy.yml）
git add -A
git commit -m "chore: setup GitHub Pages deployment workflow"

# 2. 推送到工作流监听的分支
git push origin nuxt-blog
```

推送后会自动触发：
1. GitHub 收到推送 → 匹配 `on.push.branches` → 启动 Actions 工作流
2. 工作流经历 `build` → `deploy` 两个 Job（约 2-5 分钟）
3. 部署完成后，GitHub 会发送邮件通知

### 5.2 手动触发

代码已推送但工作流未自动运行时，可以手动触发：

1. 进入仓库 → 顶部 **Actions** 标签
2. 左侧选择 **Deploy Nuxt to GitHub Pages** 工作流
3. 右侧点击 **Run workflow** 按钮
4. 选择目标分支（如 `nuxt-blog`）→ 确认运行

### 5.3 部署状态验证

**验证路径 1：Actions 日志**
1. 进入仓库 → Actions → 点击最新的 workflow run
2. 展开 `build` job → 检查 `Run npm run generate:github` 步骤
3. 确认没有红色错误，且显示构建成功
4. 展开 `deploy` job → 最后一行应显示 `Pages deployed successfully`

**验证路径 2：直接访问网站**
部署成功后访问 `https://wsgtop.github.io/`（⚠️ 用户级站点没有路径后缀），应看到：
- ✅ Nuxt 博客首页正常渲染（不是 README.md）
- ✅ 静态资源（CSS/JS/字体）加载成功，无 404，DevTools Console 无 MIME type 错误
- ✅ 点击导航路由跳转正常，刷新不 404
- ✅ 图片/字体等资源路径正确

---

## 六、常见问题排查手册

### 问题 1：访问 Pages 显示 README.md 而非博客首页

| 项 | 说明 |
|----|------|
| **原因** | Pages 部署源仍配置为 `Deploy from a branch`，GitHub 直接读取分支根目录，找不到构建产物就显示 README |
| **修复** | Settings → Pages → Source 改为 **GitHub Actions** |

---

### 问题 2：推送代码后 GitHub Actions 没有自动运行

| 可能原因 | 排查方法 |
|----------|----------|
| 工作流文件路径错误 | 确认文件在 `.github/workflows/deploy.yml`（三层目录都要对） |
| `branches` 与实际推送分支不匹配 | 检查 `on.push.branches` 写的是 `nuxt-blog` 还是 `main`，区分大小写 |
| 工作流文件未推送到远端 | 本地有文件但没 commit+push，GitHub 拿不到 |
| 首次提交工作流需要启用 | 进入 Actions 页面，可能有 `Enable workflow` 按钮需要手动点击 |

**快速排查**：在 Actions 页面点击 **Run workflow** 手动跑一次，如果手动能跑自动不行，100% 是触发配置问题。

---

### 问题 3：构建失败 — `nuxt: command not found`

```
npm run generate
sh: 1: nuxt: not found
```

| 项 | 说明 |
|----|------|
| **原因** | 在 YAML 中直接裸写了 `nuxt generate`，CI 环境的 PATH 中没有注册 `node_modules/.bin` |
| **修复（正确写法）** | `- run: npm run generate:github` |
| **原理** | `npm run` 会自动把 `node_modules/.bin` 加入 PATH，从而找到局部安装的 Nuxt |

---

### 问题 4：`EBADENGINE` 警告或依赖安装失败

```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'nuxt@4.5.1',
npm WARN EBADENGINE   required: { node: '^22.18.0 || >=24.0.0' },
npm WARN EBADENGINE   current: { node: 'v20.18.0', npm: '10.8.2' }
npm WARN EBADENGINE }
```

| 项 | 说明 |
|----|------|
| **原因** | CI 的 Node.js 版本低于 Nuxt 4 要求的最低版本 |
| **修复** | `deploy.yml` 中把 `node-version: "24"`（确保是 22 或更高） |

---

### 问题 5：构建成功但样式/JS 丢失 — 404 或 MIME type 错误（`text/css`）

这是 GitHub Pages 部署 **最高频的坑**，表现为两种形态，本质都是 `app.baseURL` 与 Pages 类型不匹配：

---

#### 形态 A：用户级站点多写了前缀（本次遇到的问题 ⚠️）
**控制台报错：**
```
❌ Failed to load module script: Expected a JavaScript module script
   but the server responded with a MIME type of "text/css".
```
DevTools → Network 里资源 URL 出现**双层嵌套**：
```
URL：https://wsgtop.github.io/wsgtop.github.io/_nuxt/entry.xxx.js
                          ^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^
                          域名部分             多余的路径前缀
```

| 项 | 说明 |
|----|------|
| **原因** | 仓库是 `<username>.github.io`（用户级站点），但 `baseURL` 错误地多写了一层 `"/wsgtop.github.io/"` |
| **修复** | 改为 `baseURL: "/"` 或不设置（默认就是 `/`） |
| **为什么 MIME 是 text/css** | 路径不存在时 GitHub Pages 返回默认错误页/ fallback CSS，浏览器拿到 CSS 却当 JS 模块加载，就报类型不匹配 |

---

#### 形态 B：项目级站点少写了前缀
DevTools → Network 中请求的资源路径**没有前缀**：
```
❌ https://user.github.io/_nuxt/entry.abc.js  (404)
✅ 正确的是 https://user.github.io/my-blog/_nuxt/entry.abc.js
```

| 项 | 说明 |
|----|------|
| **原因** | 普通仓库（如 `my-blog`）部署为项目级 Pages，但忘记在 `baseURL` 加 `/<repo>/` 前缀 |
| **修复** | 设为 `baseURL: "/my-blog/"`（注意两端斜杠不能少） |

---

**统一验证命令**（改完 baseURL 必跑）：
```bash
npm run generate:github
# 然后打开 dist/index.html，查看 <script> 和 <link> 的 src/href
#   用户级站点 → 应为 /_nuxt/xxx
#   项目级站点 → 应为 /my-blog/_nuxt/xxx
```

---

### 问题 6：刷新子页面出现 404（如 /articles/xxx）

| 项 | 说明 |
|----|------|
| **原因** | 静态站点生成时，动态路由对应的 HTML 文件没有被预渲染出来 |
| **修复 1** | 在 `nitro.prerender.routes` 中显式列出所有要预渲染的路由 |
| **修复 2** | 添加 `crawlLinks: true` 让 Nitro 自动从首页爬取所有链接并生成：<br>`nitro: { prerender: { routes: ["/"], crawlLinks: true } }` |
| **验证** | 构建后检查 `.output/public/articles/` 目录下是否有对应 HTML 文件 |

---

### 问题 7：本地 Windows 开发遇到 `EPERM: operation not permitted, rename`

```
EPERM: operation not permitted, rename '...payload_about.json.tmp' -> '...payload_about.json'
```

| 项 | 说明 |
|----|------|
| **原因** | Windows 下 Nuxt 写缓存时，临时文件被 Defender/杀毒/VS Code 索引锁定，导致 rename 失败 |
| **立即修复** | 运行 `npm run clean` 清理缓存 → 重启终端再跑 `npm run dev` |
| **根治方案** | 在 Windows Defender 中把项目目录 `D:\Code\Github\wsgtop.github.io` 和进程 `node.exe` 加入排除列表 |

---

### 问题 8：Actions 中 `cache: npm` 报 lockfile 不存在

```
Dependencies lock file is not found in /home/runner/work/... Supported file patterns: package-lock.json
```

| 项 | 说明 |
|----|------|
| **原因** | 仓库没有提交 `package-lock.json`，但 `setup-node` 配置了 `cache: "npm"` |
| **修复 A（推荐）** | 本地运行 `npm install` 后 commit 生成的 `package-lock.json` |
| **修复 B** | 临时删除 `deploy.yml` 中 `cache: "npm"` 这一行（构建会变慢但功能正常） |

---

## 七、本地模拟部署验证

推送前建议在本地先跑一遍构建，确保没问题，节省 CI 调试时间：

```bash
# 1. 清理旧缓存（可选，遇到问题再跑）
npm run clean

# 2. 使用 GitHub 环境构建
npm run generate:github

# 3. 验证构建产物结构
#    .output/public/ 目录下应该有 index.html、_nuxt/、200.html、404.html 等
dir .output\public

# 4. 本地预览静态站点（模拟 GitHub Pages 环境）
npm run preview
#    打开浏览器访问提示的地址（默认 http://localhost:3000）
#    确认页面、路由、资源都正常，再推送
```

---

## 八、附录：配置文件完整清单

部署 GitHub Pages 涉及的所有文件列表（确保都已提交到仓库根目录）：

| 文件路径 | 必须 | 作用 |
|----------|------|------|
| `nuxt.config.ts` | ✅ | 配置 baseURL、runtimeConfig、nitro 预渲染 |
| `package.json` | ✅ | 包含 `generate:github` 和 `clean` 等脚本 |
| `.env.github` | ✅ | GitHub Pages 专属环境变量 |
| `.github/workflows/deploy.yml` | ✅ | CI/CD 自动化构建与部署工作流 |
| `package-lock.json` | 推荐 | 锁定依赖版本，加速 CI 安装，配合 `cache: "npm"` |
| `.gitignore` | ✅ | 排除 `.nuxt`、`.output`、`dist`、`node_modules` 等构建产物 |

`.gitignore` 最少需要包含以下条目：

```gitignore
# Nuxt dev/build outputs
.output
.data
.nuxt
.nitro
.cache
dist

# Node dependencies
node_modules

# Logs
logs
*.log
```

---

## 快速诊断 Checklist

每次部署出问题时，按这个顺序逐一核对：

- [ ] Settings → Pages → Source 是否为 **GitHub Actions**？
- [ ] `deploy.yml` 的 `node-version` 是否 >= 22？
- [ ] 构建命令是否使用 `npm run generate:github`（而非裸 `nuxt generate`）？
- [ ] `nuxt.config.ts` 的 `baseURL` 是否与站点类型匹配？<br>　　· 用户级（仓库名 `.github.io` 结尾）→ `"/"` 或不设置<br>　　· 项目级（普通仓库）→ `"/<repo>/"`（两端斜杠）
- [ ] `upload-pages-artifact` 的 path 是否为 `./.output/public`？
- [ ] `on.push.branches` 是否与实际推送分支一致？
- [ ] `nitro.prerender` 是否开启了 `crawlLinks: true`？
- [ ] Vite 构建优化是否在 `environments.client` 中配置（避免 SSR 样式占位符冲突）？
- [ ] 本地先跑过 `npm run generate:github && npm run preview` 验证过？

以上全部 ✅，部署成功率 > 99%。
