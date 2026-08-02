<template>
  <div class="page-root px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
    <!-- A1 通栏纸张：把 Hero 和 最新文章 包在同一张连续纸里，上下无缝隙
         手机端不加分层（无留白可区分），≥ md 开始出现白纸背景 + 左右边 + 阴影 -->
    <div class="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-7xl
                px-3 sm:px-4 md:px-8 lg:px-10
                md:bg-bg-elevated md:border md:border-border-default md:rounded-md md:shadow-md md:my-6">
      <!-- Hero 区 -->
      <section class="relative text-center mb-12 sm:mb-16 lg:mb-20 pt-6 sm:pt-8 lg:pt-10">
        <div class="absolute -inset-x-10 -top-10 -z-10 overflow-hidden pointer-events-none h-[350px]">
          <div class="absolute left-1/2 top-8 -translate-x-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px]
                      bg-gradient-to-br from-indigo-400/20 via-violet-400/10 to-transparent
                      rounded-full blur-3xl dark:from-indigo-500/15 dark:via-violet-500/10" />
        </div>

        <span class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 mb-5 sm:mb-6
                     text-[10px] sm:text-xs font-semibold tracking-wider uppercase
                     rounded-full bg-white/70 dark:bg-slate-900/60
                     border border-slate-200/70 dark:border-slate-800
                     text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Icon name="ph:sparkle-bold" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Welcome
        </span>

        <h1 class="font-serif font-bold tracking-tight
                   text-slate-900 dark:text-slate-50
                   bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700
                   dark:from-white dark:via-slate-100 dark:to-indigo-200
                   bg-clip-text text-transparent
                   leading-[1.1]
                   text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          个人博客
        </h1>
        <p class="mt-4 sm:mt-6 text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto
                  text-sm sm:text-base md:text-lg">
          记录技术探索与生活随笔。分享前端、后端、人工智能与一切值得记录的思考。
        </p>

        <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <NuxtLink to="/articles" class="blog-btn-primary !px-5 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base">
            查看所有文章
            <Icon name="ph:arrow-right-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </NuxtLink>
          <NuxtLink to="/categories" class="blog-btn-ghost !px-5 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base
                                            border border-slate-200 dark:border-slate-800">
            <Icon name="ph:folder-simple-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            浏览分类
          </NuxtLink>
        </div>

        <!-- 统计数据 -->
        <div class="mt-10 sm:mt-14 grid grid-cols-3 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto">
          <div class="blog-card !p-3 sm:!p-4 !bg-white/50 dark:!bg-slate-900/40">
            <div class="font-serif font-bold text-indigo-600 dark:text-indigo-400
                        text-xl sm:text-2xl">{{ totalArticles }}</div>
            <div class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">篇文章</div>
          </div>
          <div class="blog-card !p-3 sm:!p-4 !bg-white/50 dark:!bg-slate-900/40">
            <div class="font-serif font-bold text-violet-600 dark:text-violet-400
                        text-xl sm:text-2xl">{{ totalCategories }}</div>
            <div class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">个分类</div>
          </div>
          <div class="blog-card !p-3 sm:!p-4 !bg-white/50 dark:!bg-slate-900/40">
            <div class="font-serif font-bold text-fuchsia-600 dark:text-fuchsia-400
                        text-xl sm:text-2xl">∞</div>
            <div class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">行代码</div>
          </div>
        </div>
      </section>

      <!-- 最新文章列表区 -->
      <section class="pb-8 sm:pb-10 lg:pb-12">
        <div class="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 class="font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-2.5
                       text-xl sm:text-2xl md:text-3xl">
              <span class="inline-flex items-center justify-center rounded-xl
                          bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400
                          h-7 w-7 sm:h-9 sm:w-9">
                <Icon name="ph:clock-bold" class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </span>
              最新文章
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 ml-9 sm:ml-12">
              最近发布的 {{ Math.min(5, articles?.length || 0) }} 篇文章
            </p>
          </div>
          <NuxtLink
            to="/articles"
            class="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium
                   text-indigo-600 dark:text-indigo-400
                   hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            查看全部
            <Icon name="ph:arrow-right-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </NuxtLink>
        </div>

        <div v-if="articles && articles.length > 0" class="grid gap-4 sm:gap-5">
          <ArticleCard
            v-for="article in articles"
            :key="article._path"
            :article="article"
          />
        </div>
        <div v-else class="blog-card text-center py-12 sm:py-16">
          <Icon name="ph:file-text-bold" class="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-slate-300 dark:text-slate-700 mb-3 sm:mb-4" />
          <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400">暂无文章，敬请期待～</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData("home-articles", () =>
  queryContent("articles").sort({ date: -1 }).limit(5).find(),
);
const { data: allArticles } = await useAsyncData("home-all-articles-meta", () =>
  queryContent("articles").only(["category"]).find(),
);

const totalArticles = computed(() => allArticles.value?.length || 0);
const totalCategories = computed(() => {
  const set = new Set<string>();
  for (const a of (allArticles.value || []) as any[]) {
    if (a?.category) set.add(a.category);
  }
  return set.size;
});
</script>

<style lang="less" scoped></style>
