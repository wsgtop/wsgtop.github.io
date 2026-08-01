<template>
  <div v-if="articles.length > 0" class="blog-card p-5 sm:p-6">
    <h3 class="flex items-center gap-2 font-serif text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
      <Icon name="ph:clock-bold" class="w-4 h-4 text-indigo-500" />
      最新文章
    </h3>
    <ul class="space-y-1.5">
      <li v-for="article in articles" :key="article._id">
        <NuxtLink
          :to="article._path"
          class="flex flex-col gap-1 p-3 rounded-xl no-underline
                 hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                 group transition-colors duration-200"
        >
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200
                       group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
            {{ article.title }}
          </span>
          <span v-if="article.date" class="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <Icon name="ph:calendar-dots-bold" class="w-3 h-3" />
            {{ article.date }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  articles: Array<{
    _id: string;
    title: string;
    date?: string;
    _path: string;
  }>;
}>();
</script>

<style lang="less" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
