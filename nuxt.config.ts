export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/content", "@nuxt/icon", "@nuxtjs/tailwindcss"],
  app: {
    head: {
      meta: [
        // 移动端最关键的 viewport 设置，不写的话浏览器会按 980px 宽做桌面缩放
        // 导致手机/平板显示的页面被强行放大，响应式断点完全失效
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          name: "format-detection",
          content: "telephone=no,email=no,address=no",
        },
        {
          name: "theme-color",
          content: "#ffffff",
          media: "(prefers-color-scheme: light)",
        },
        {
          name: "theme-color",
          content: "#020617",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      title: "我的博客",
      link: [
        // 手动托管Google fonts与霞骛文楷字体，@font-face声明见各css文件
        {
          rel: "stylesheet",
          href: "/fonts/inter/inter.css",
        },
        {
          rel: "stylesheet",
          href: "/fonts/jetbrains-mono/jetbrains-mono.css",
        },
        {
          rel: "stylesheet",
          href: "/fonts/noto-sans-sc/noto-sans-sc.css",
        },
        {
          rel: "stylesheet",
          href: "/fonts/noto-serif-sc/noto-serif-sc.css",
        },
      ],
      script: [
        {
          innerHTML: `
            (function(){
              try{
                var stored = localStorage.getItem('theme');
                var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                if(isDark){
                  document.documentElement.classList.add('dark');
                }
                
              }catch(e){}
            })()
        `,
          type: "text/javascript",
        },
      ],
    },
    // ⚠️  仓库名是 <username>.github.io（用户级 Pages 站点），
    //     部署后的 URL 是 https://wsgtop.github.io/，没有任何路径前缀，
    //     所以 baseURL 必须留空或设为 "/"，绝不能写成 "/wsgtop.github.io/"！
    //     只有普通项目级站点（仓库名非 .github.io 结尾）才需要加 "/<repo>/" 前缀。
    baseURL: "/",
  },
  runtimeConfig: {
    public: {
      apiBase: "", // 默认值留空，会被环境变量覆盖
    },
  },
  // ──────────────────────────────────────────────
  // Vite 构建优化（代码压缩 + Chunk 合并）
  //
  // 说明 1：GitHub Pages 通过 Fastly CDN 自动做传输层 Gzip 压缩，
  //         不需要手动生成 .gz / .br 文件（上传了也不会自动加 Content-Encoding）。
  //         但构建端的代码压缩必须开——它让源文件本身更小，与 CDN 压缩是叠加关系。
  //
  // 说明 2：压缩和 manualChunks 只在 client 构建（environments.client）中生效。
  //         SSR / Nitro prerender 侧使用 Nuxt 默认配置，
  //         避免自定义 rollupOptions 破坏 Nitro 的样式占位符解析
  //         （如 entry-styles-2.mjs-!~{00E}~.js 这类内部约定）。
  // ──────────────────────────────────────────────
  vite: {
    environments: {
      client: {
        build: {
          // ── 1. 代码压缩（只对发给浏览器的产物生效） ──
          // terser 压缩率比默认 esbuild 高 5-10%，构建慢 1.5x 左右
          // 权衡：部署是 CI 自动跑，多花 10 秒换用户少加载 5-10KB 很值
          minify: "terser",
          terserOptions: {
            compress: {
              drop_console: true,      // 生产环境移除 console.log 等调试输出
              drop_debugger: true,     // 移除 debugger 语句
              passes: 2,               // 两轮压缩（更高压缩率，构建时间稍增）
            },
            mangle: {
              safari10: true,          // Safari 10+ 一些变量名解析兼容
            },
          },
          sourcemap: false,            // 生产环境不生成 .map（防源码泄露 + 省体积）
          cssMinify: true,             // 压缩 CSS（Vite 默认开，显式声明避免被覆盖）
          reportCompressedSize: false, // 关闭压缩后大小报告（省构建时间）

          // ── 2. Chunk 合并（减少请求数量，避免几十个 1KB 小 chunk） ──
          rollupOptions: {
            output: {
              manualChunks(id) {
                // ── 策略：按"稳定程度"分块，最大化浏览器缓存命中率 ──
                //   框架核心（几年不更）→ core-vendor，长期缓存
                //   博客生态依赖（月更）→ content-vendor
                //   业务页面（日常更）→ Nuxt 默认按路由拆，不手动合并
                //   → 日常更文章时，core/content 两个 vendor chunk 命中 304

                // === 分块 1：Vue / Nuxt 运行时核心（超大、超稳定） ===
                if (
                  id.includes("node_modules/vue/") ||
                  id.includes("node_modules/@vue/") ||
                  id.includes("node_modules/vue-router/") ||
                  id.includes("node_modules/nuxt/") ||
                  id.includes("node_modules/nuxt-nightly/") ||
                  id.includes("node_modules/@nuxt/kit/") ||
                  id.includes("node_modules/@nuxt/schema/") ||
                  id.includes("node_modules/nuxi/") ||
                  id.includes("node_modules/h3/") ||
                  id.includes("node_modules/nitropack/") ||
                  id.includes("node_modules/rollup/") ||
                  id.includes("node_modules/esbuild/") ||
                  id.includes("node_modules/vite/") ||
                  id.includes("node_modules/@vitejs/")
                ) {
                  return "core-vendor";
                }

                // === 分块 2：博客生态依赖（@nuxt/content、Tailwind 等） ===
                if (
                  id.includes("node_modules/@nuxt/content/") ||
                  id.includes("node_modules/@nuxtjs/tailwindcss/") ||
                  id.includes("node_modules/@tailwindcss/") ||
                  id.includes("node_modules/tailwindcss/") ||
                  id.includes("node_modules/@nuxt/icon/") ||
                  id.includes("node_modules/@iconify/") ||
                  id.includes("node_modules/less/")
                ) {
                  return "content-vendor";
                }

                // 其余业务代码 → Nuxt 默认按路由拆
                // 不要合并业务代码，否则改一篇文章用户要重下整个业务包
              },
            },
          },
        },
      },
    },
  },

  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,  // 从首页开始自动爬取所有链接生成 HTML + payload
                         // 避免刷新文章页出现 404，同时 payload 按页精确生成
    },
  },

  icon: {
    clientBundle: {
      scan: true,
      includeCollections: true,
    },
    serverBundle: {
      collections: ["ph"],
    },
  },
});
