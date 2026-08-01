<template>
  <div class="py-6 sm:py-12 lg:py-16 max-w-3xl mx-auto px-3 sm:px-6">
    <!-- Hero 头像/标题区 -->
    <header class="text-center mb-12 sm:mb-16">
      <div class="relative inline-flex mb-6 sm:mb-8">
        <div class="absolute -inset-3 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/25 to-fuchsia-400/20 blur-xl" />
        <div class="relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center
                    rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500
                    text-white shadow-2xl shadow-violet-500/30">
          <Icon name="ph:user-circle-bold" class="w-10 h-10 sm:w-14 sm:h-14" />
        </div>
      </div>

      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight
                 bg-gradient-to-br from-slate-900 via-indigo-800 to-violet-700
                 dark:from-white dark:via-slate-100 dark:to-indigo-200
                 bg-clip-text text-transparent">
        关于我
      </h1>
      <p class="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300
                max-w-xl mx-auto leading-relaxed">
        你好～我是这个博客的作者，一名热爱技术与生活的开发者。
      </p>
    </header>

    <!-- 自我介绍卡片 -->
    <section class="blog-card p-5 sm:p-8 lg:p-10 mb-8 sm:mb-10">
      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5 mb-5 sm:mb-6">
        <span class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Icon name="ph:hand-waving-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        个人简介
      </h2>
      <div class="text-slate-700 dark:text-slate-300 text-[0.95rem] sm:text-base leading-[1.9] space-y-4 sm:space-y-5">
        <p>
          一名全栈开发者，目前专注于 <b class="text-indigo-600 dark:text-indigo-400">前端工程化</b>、
          <b class="text-violet-600 dark:text-violet-400">Vue / Nuxt 生态</b>、以及
          <b class="text-fuchsia-600 dark:text-fuchsia-400">AI 应用开发</b>。
        </p>
        <p>
          喜欢把复杂的问题拆解成简单的文档，把灵感写成文章、做成工具。
          业余时间爱折腾独立开发，也会写一些与生活、阅读、旅行相关的内容。
        </p>
        <p>
          这个博客是我个人的「数字花园」——记录思考，不追求完美，但追求真诚。
          如果你对文章内容有疑问，或想与我交流，欢迎通过下方方式联系～
        </p>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="blog-card p-5 sm:p-8 lg:p-10 mb-8 sm:mb-10">
      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5 mb-5 sm:mb-6">
        <span class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <Icon name="ph:code-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        常用技术栈
      </h2>
      <div class="flex flex-wrap gap-2 sm:gap-2.5">
        <span v-for="s in stacks" :key="s" class="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full
                    bg-slate-100 text-slate-700
                    dark:bg-slate-800/70 dark:text-slate-200
                    border border-slate-200/70 dark:border-slate-700/70">
          {{ s }}
        </span>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="blog-card p-5 sm:p-8 lg:p-10 mb-8 sm:mb-10">
      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5 mb-5 sm:mb-6">
        <span class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <Icon name="ph:envelope-simple-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        联系方式
      </h2>
      <ul class="grid gap-3 sm:gap-4">
        <li class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
          <span class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm">
            <Icon name="ph:envelope-bold" class="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </span>
          <div class="min-w-0">
            <p class="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Email</p>
            <p class="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">hello@my-blog.dev</p>
          </div>
        </li>
        <li class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
          <span class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm">
            <Icon name="ph:github-logo-bold" class="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </span>
          <div class="min-w-0">
            <p class="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">GitHub</p>
            <p class="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">github.com/my-blog</p>
          </div>
        </li>
        <li class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
          <span class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm">
            <Icon name="ph:rss-bold" class="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </span>
          <div class="min-w-0">
            <p class="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">RSS 订阅</p>
            <p class="font-medium text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">/rss.xml</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- 底部 CTA -->
    <div class="text-center pt-4 sm:pt-6">
      <NuxtLink to="/articles" class="blog-btn-primary !px-7 !py-3 !text-sm sm:!text-base">
        看看我的文章
        <Icon name="ph:arrow-right-bold" class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const stacks = [
  'TypeScript', 'Vue 3', 'Nuxt 3/4', 'Vite',
  'Tailwind CSS', 'Node.js', 'Nitro',
  'PostgreSQL', 'Redis', 'Docker',
  'Python', 'LangChain', 'SQLite',
];
</script>

<style lang="less" scoped></style>
