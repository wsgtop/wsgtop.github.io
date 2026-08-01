<template>
<div class="page-root px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
    <div class="mx-auto max-w-3xl">
        <!-- 页面标题 -->
        <header class="mb-8 sm:mb-10 lg:mb-12">
            <h1 class="font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100
                       flex items-center gap-2.5 sm:gap-3
                       text-2xl sm:text-3xl md:text-4xl">
                <span class="inline-flex items-center justify-center rounded-2xl
                             bg-gradient-to-br from-violet-500 to-fuchsia-600
                             text-white shadow-lg shadow-violet-500/25
                             h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                    <Icon name="ph:folders-bold" class="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                分类浏览
            </h1>
            <p class="text-slate-500 dark:text-slate-400 mt-2 sm:mt-3
                      ml-11 sm:ml-14
                      text-sm sm:text-base">
                共 {{ categories.length }} 个分类，{{ totalArticles }} 篇文章
            </p>
        </header>

        <!-- 分类网格 -->
        <div v-if="categories.length > 0" class="grid gap-4 sm:gap-5 sm:grid-cols-2">
            <NuxtLink
                v-for="cat in categories"
                :key="cat.name"
                :to="`/categories/${cat.name}`"
                class="group blog-card p-4 sm:p-6 no-underline relative overflow-hidden"
            >
                <!-- 装饰 -->
                <div class="absolute -right-5 sm:-right-6 -top-5 sm:-top-6 w-20 sm:w-24 h-20 sm:h-24 rounded-full
                            bg-gradient-to-br from-violet-400/20 to-fuchsia-400/10
                            blur-2xl group-hover:from-violet-400/30 group-hover:to-fuchsia-400/20
                            transition-all duration-500" />
                <div class="relative flex items-start gap-3 sm:gap-4">
                    <div class="flex items-center justify-center rounded-2xl shrink-0
                                bg-gradient-to-br from-violet-500 to-fuchsia-600
                                text-white shadow-md shadow-violet-500/25
                                group-hover:scale-110 transition-transform duration-300
                                h-11 w-11 sm:h-12 sm:w-12">
                        <Icon name="ph:folder-bold" class="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <h3 class="font-serif font-bold
                                   text-slate-800 dark:text-slate-100
                                   group-hover:text-violet-600 dark:group-hover:text-violet-400
                                   transition-colors mb-1
                                   text-lg sm:text-xl">
                            {{ cat.name }}
                        </h3>
                        <div class="flex items-center gap-3 mt-2.5 sm:mt-3">
                            <span class="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold
                                        bg-violet-50 text-violet-700
                                        dark:bg-violet-500/15 dark:text-violet-300">
                                <Icon name="ph:file-text-bold" class="w-3 h-3" />
                                {{ cat.count }} 篇
                            </span>
                            <span class="inline-flex items-center gap-1 text-[11px] sm:text-xs
                                         text-slate-400 dark:text-slate-500
                                         group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors ml-auto">
                                查看
                                <Icon name="ph:arrow-right-bold" class="w-3 h-3 sm:w-3.5 sm:h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <!-- 空状态 -->
        <p v-else class="blog-card text-center py-16 sm:py-20 mt-6 sm:mt-8">
            <Icon name="ph:folder-notch-open-bold" class="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4 sm:mb-5 block" />
            <span class="text-slate-500 dark:text-slate-400 text-sm sm:text-base">暂无分类</span>
        </p>
    </div>
</div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles-categories',()=>
queryContent('articles').only(['category']).find()
)

const totalArticles = computed(() => articles.value?.length || 0);

const categories = computed(() => {
    if(!articles.value){
        return []
    }
    const map = new Map<string,number>()
    for(const article of articles.value){
        const cat = (article as any).category
        if(cat){
            map.set(cat,(map.get(cat) || 0) + 1)
        }
    }
    return Array.from(map.entries()).map(([name,count])=>({name,count})).sort((a,b)=>b.count - a.count)
})
</script>

<style lang="less" scoped>

</style>
