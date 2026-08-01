<template>
    <div class="absolute left-0 right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-1">
        <div class="overflow-hidden rounded-md
                    border border-slate-200/70 dark:border-slate-800/70
                    bg-white/95 dark:bg-slate-950/95
                    shadow-2xl shadow-slate-900/10 dark:shadow-black/40
                    backdrop-blur-xl">
            <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                <p class="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    搜索结果 · {{ results.length }} 条
                </p>
            </div>
            <ul v-if="results.length > 0" class="max-h-80 overflow-y-auto py-1.5">
                <li v-for="item in results" :key="item.path">
                    <NuxtLink
                        :to="item.path"
                        @click="$emit('select')"
                        class="block px-4 py-3 mx-1.5 rounded-md
                               hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                               transition-colors duration-150 no-underline
                               group"
                    >
                        <p class="font-semibold text-sm text-slate-800 dark:text-slate-100
                                  group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                            {{ item.title }}
                        </p>
                        <p v-if="item.description" class="text-xs mt-1 text-slate-500 dark:text-slate-400 line-clamp-1">
                            {{ item.description }}
                        </p>
                        <div v-if="item.category || item.tags?.length" class="flex flex-wrap items-center gap-2 mt-2">
                            <span v-if="item.category" class="blog-category !px-2 !py-0.5 text-[10px]">
                                {{ item.category }}
                            </span>
                            <span
                                v-for="tag in (item.tags || []).slice(0, 3)"
                                :key="tag"
                                class="blog-tag !px-1.5 !py-0.5 text-[10px]"
                            >
                                #{{ tag }}
                            </span>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
            <div v-else class="px-4 py-6 text-center">
                <Icon name="ph:magnifying-glass" class="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p class="text-sm text-slate-500 dark:text-slate-400">没有找到相关文章</p>
            </div>
            <div class="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80
                        flex items-center justify-between
                        text-[11px] text-slate-400 dark:text-slate-500">
                <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">ESC</kbd>
                    关闭
                </span>
                <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">↵</kbd>
                    打开
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SearchDoc } from '~/composables/useSearch';
defineProps<{
  results: SearchDoc[];
}>();
defineEmits<{
  (e: 'select'): void;
}>();
</script>

<style lang="less" scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-in-from-top-1 {
  from { transform: translateY(-4px); }
  to { transform: translateY(0); }
}
.animate-in {
  animation: fade-in 150ms ease, slide-in-from-top-1 150ms ease;
}
</style>
