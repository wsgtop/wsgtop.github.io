<template>
  <div class="page-root px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
    <div v-if="article" class="mx-auto max-w-3xl">
      <!-- 文章头部 -->
      <header class="mb-8 sm:mb-10 lg:mb-12">
        <h1 class="font-serif font-bold tracking-tight text-slate-900 dark:text-slate-50
                   leading-[1.2] break-words
                   text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl"
            style="word-break: break-word;">
          {{ article.title }}
        </h1>

        <!-- 元信息条 -->
        <div class="mt-5 sm:mt-7 md:mt-8 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 pb-5 sm:pb-7 md:pb-8
                    border-b border-dashed border-slate-200 dark:border-slate-800">
          <!-- 日期 -->
          <span class="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span class="flex items-center justify-center rounded-xl
                        bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400
                        h-8 w-8 sm:h-9 sm:w-9">
              <Icon name="ph:calendar-blank-bold" class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
            <span class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">发布日期</span>
              <span class="text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm">{{ article.date }}</span>
            </span>
          </span>

          <!-- 分类 -->
          <NuxtLink
            v-if="article.category"
            :to="`/categories/${article.category}`"
            class="inline-flex items-center gap-2 text-sm no-underline group"
          >
            <span class="flex items-center justify-center rounded-xl
                        bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400
                        h-8 w-8 sm:h-9 sm:w-9">
              <Icon name="ph:folder-simple-bold" class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
            <span class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">所属分类</span>
              <span class="text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm
                           group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {{ article.category }}
              </span>
            </span>
          </NuxtLink>

          <!-- 预估阅读时间 -->
          <span class="inline-flex items-center gap-2 text-sm">
            <span class="flex items-center justify-center rounded-xl
                        bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400
                        h-8 w-8 sm:h-9 sm:w-9">
              <Icon name="ph:coffee-bold" class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
            <span class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">阅读时间</span>
              <span class="text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm">{{ readingTime }} 分钟</span>
            </span>
          </span>
        </div>

        <!-- 描述 -->
        <p v-if="article.description" class="mt-5 sm:mt-7 md:mt-8 leading-relaxed
                   text-slate-600 dark:text-slate-300
                   border-l-4 border-indigo-500 pl-4 sm:pl-5 py-1 italic
                   text-sm sm:text-base md:text-lg">
          {{ article.description }}
        </p>

        <!-- 标签 -->
        <div v-if="article.tags && article.tags.length > 0" class="mt-5 sm:mt-6 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Icon name="ph:hash-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="blog-tag"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- 正文卡片 -->
      <div class="blog-card !p-5 sm:!p-7 md:!p-10 lg:!p-14">
        <ContentRenderer :value="article" class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none" />
      </div>

      <!-- 底部操作区 -->
      <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4
                  px-4 sm:px-6 py-4 sm:py-5 rounded-md
                  bg-white/50 dark:bg-slate-900/40
                  border border-slate-200/50 dark:border-slate-800">
        <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          <Icon name="ph:heart-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
          觉得有帮助？分享给朋友吧
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            title="返回顶部"
            @click="scrollToTop"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md
                   text-xs sm:text-sm font-medium
                   text-slate-600 dark:text-slate-300
                   hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Icon name="ph:arrow-up-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            顶部
          </button>
          <NuxtLink
            to="/articles"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl
                   text-xs sm:text-sm font-medium
                   bg-indigo-600 text-white
                   hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            <Icon name="ph:arrow-left-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            文章列表
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="mx-auto max-w-lg text-center py-16 sm:py-24">
      <div class="relative inline-flex mb-6 sm:mb-8">
        <div class="absolute -inset-3 rounded-3xl bg-gradient-to-br from-rose-400/30 via-amber-400/20 to-transparent blur-xl" />
        <div class="relative inline-flex items-center justify-center
                    h-20 w-20 sm:h-24 sm:w-24 rounded-[2rem]
                    bg-gradient-to-br from-rose-100 to-amber-100
                    dark:from-rose-500/20 dark:to-amber-500/20 shadow-xl">
          <Icon
            name="ph:file-x-bold"
            class="h-10 w-10 sm:h-12 sm:w-12 text-rose-500 dark:text-rose-400"
          />
        </div>
      </div>
      <h2 class="font-serif font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3
                 text-2xl sm:text-3xl">文章未找到</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
        该文章不存在或已被移除，去看看其他文章吧～
      </p>
      <NuxtLink to="/articles" class="blog-btn-primary !px-6 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base">
        <Icon name="ph:arrow-left-bold" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        返回文章列表
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const { data: article } = await useAsyncData(`article-${slug}`, () =>
  queryContent("articles")
    .where({ _path: `/articles/${slug}` })
    .findOne(),
);

// 简单的阅读时间估算（按中文 400 字/分钟）
const readingTime = computed(() => {
  const body = (article.value as any)?.body?.children || [];
  let totalChars = 0;
  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.type === "text") totalChars += (n.value || "").length;
      if (n.children) walk(n.children);
    }
  };
  walk(body);
  const t = Math.max(1, Math.ceil(totalChars / 400));
  return t;
});
</script>

<style lang="less" scoped></style>
