<template>
<div class="page-root px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
    <div class="mx-auto max-w-3xl">
        <!-- 分类头卡片 -->
        <header class="mb-8 sm:mb-10 lg:mb-12">
            <div class="blog-card p-5 sm:p-7 lg:p-8 relative overflow-hidden">
                <div class="absolute -right-8 sm:-right-10 -top-8 sm:-top-10 w-40 sm:w-48 h-40 sm:h-48 rounded-full
                            bg-gradient-to-br from-violet-400/20 via-fuchsia-400/15 to-indigo-400/10
                            blur-3xl pointer-events-none" />
                <div class="relative flex items-center gap-4 sm:gap-5">
                    <div class="flex items-center justify-center rounded-2xl shrink-0
                                bg-gradient-to-br from-violet-500 to-fuchsia-600
                                text-white shadow-xl shadow-violet-500/30
                                h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                        <Icon name="ph:folder-bold" class="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]
                                  text-violet-500 dark:text-violet-400 mb-1 sm:mb-1.5">
                            Category
                        </p>
                        <h1 class="font-serif font-bold tracking-tight
                                   text-slate-900 dark:text-slate-50
                                   text-2xl sm:text-3xl md:text-4xl">
                            {{ categoryName }}
                        </h1>
                        <p class="text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 text-sm sm:text-base">
                            共 <span class="font-semibold text-violet-600 dark:text-violet-400">{{ articles?.length || 0 }}</span> 篇文章归档在此分类
                        </p>
                    </div>
                </div>
            </div>
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
        <div v-else class="blog-card text-center py-16 sm:py-20 mt-4 sm:mt-6">
            <Icon name="ph:inbox-bold" class="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4 sm:mb-5 block" />
            <h3 class="font-serif font-bold text-slate-700 dark:text-slate-200 mb-2 text-lg sm:text-xl">
                该分类暂无文章
            </h3>
            <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 sm:mb-6 text-sm sm:text-base">
                作者正在努力撰写中，或者去别的分类逛逛？
            </p>
            <NuxtLink to="/categories" class="blog-btn-ghost border border-slate-200 dark:border-slate-800
                                               !px-5 sm:!px-6 !py-2.5 !text-sm sm:!text-base">
                <Icon name="ph:folders-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                查看所有分类
            </NuxtLink>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
const route = useRoute()
const categoryName = route.params.name as string

const { data: articles } = await useAsyncData(`category-${categoryName}`,() =>
queryContent('articles').where({category: categoryName}).sort({date: -1}).find()
)
</script>

<style lang="less" scoped>

</style>
