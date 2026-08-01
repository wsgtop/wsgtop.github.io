<template>
    <div class="page-root px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        <div class="mx-auto max-w-3xl">
            <!-- 页面标题 -->
            <header class="mb-8 sm:mb-10 lg:mb-12">
                <h1 class="font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100
                           flex items-center gap-2.5 sm:gap-3
                           text-2xl sm:text-3xl md:text-4xl">
                    <span class="inline-flex items-center justify-center rounded-2xl
                                bg-gradient-to-br from-indigo-500 to-violet-600
                                text-white shadow-lg shadow-indigo-500/25
                                h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                        <Icon name="ph:books-bold" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-6.5 lg:h-6.5" />
                    </span>
                    全部文章
                </h1>
                <p class="text-slate-500 dark:text-slate-400 mt-2 sm:mt-3
                          ml-11 sm:ml-14 lg:ml-15
                          text-sm sm:text-base">
                    共 {{ articles?.length || 0 }} 篇文章，按时间倒序排列
                </p>
            </header>

            <!-- 文章列表 -->
            <div v-if="articles && articles.length > 0" class="space-y-4 sm:space-y-5">
                <ArticleCard
                    v-for="article in articles"
                    :key="article._path"
                    :article="article as any"
                />
            </div>

            <!-- 空状态 -->
            <div v-else class="blog-card text-center py-16 sm:py-20 mt-6 sm:mt-8">
                <Icon name="ph:notebook-bold" class="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4 sm:mb-5" />
                <h3 class="font-serif text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">这里还没有文章</h3>
                <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm sm:text-base">
                    作者还在酝酿中，请稍后再来看看～
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData("all-articles", () => 
  queryContent("articles").sort({ date: -1 }).find()
);
</script>

<style lang="less" scoped></style>
