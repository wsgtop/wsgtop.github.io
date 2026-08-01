<template>
  <NuxtLink
    :to="article._path"
    class="blog-card block p-6 sm:p-7 no-underline"
  >
    <div class="flex flex-col gap-4">
      <div class="flex-1 min-w-0 flex flex-col gap-3">
        <!-- 标题行 + 箭头 -->
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-serif text-xl sm:text-[1.35rem] font-bold tracking-tight
                     text-slate-900 dark:text-slate-100 leading-snug">
            {{ article.title }}
          </h3>
          <Icon
            name="ph:arrow-right-bold"
            class="shrink-0 mt-1.5 w-5 h-5 text-slate-400 dark:text-slate-500"
          />
        </div>

        <!-- 描述 -->
        <p v-if="article.description" class="text-slate-600 dark:text-slate-400 text-[0.95rem] leading-relaxed line-clamp-2">
          {{ article.description }}
        </p>

        <!-- 元信息 -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <span v-if="article.date" class="inline-flex items-center gap-1.5 text-xs sm:text-[0.8rem] text-slate-500 dark:text-slate-400 font-medium">
            <Icon name="ph:calendar-bold" class="w-3.5 h-3.5 text-indigo-500/80 dark:text-indigo-400/80" />
            {{ article.date }}
          </span>
          <span v-if="article.category" class="blog-category">
            <Icon name="ph:folder-simple-bold" class="w-3 h-3" />
            {{ article.category }}
          </span>
        </div>

        <!-- 标签 -->
        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="blog-tag"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  article: {
    _id?: string;
    _path: string;
    title: string;
    description?: string;
    date?: string;
    category?: string;
    tags?: string[];
  };
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
