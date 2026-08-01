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
    baseURL: "/wsgtop.github.io/",
  },
  runtimeConfig: {
    public: {
      apiBase: "", // 默认值留空，会被环境变量覆盖
    },
  },
  nitro: {
    prerender: {
      routes: ["/"],
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
