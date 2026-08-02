<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
    <div class="mx-auto max-w-[1200px] xl:max-w-7xl px-3 sm:px-6 lg:px-8">
      <div class="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 min-w-0">
        <!-- Logo 区（始终显示：图标 + 博客标题文字，窄屏缩小字号） -->
        <NuxtLink to="/" class="flex items-center gap-1.5 sm:gap-2.5 group shrink-0" @click="closeMenu">
          <div class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 group-hover:shadow-lg group-hover:shadow-indigo-500/35 transition-all">
            <Icon name="ph:pen-nib-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span class="font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap
                       text-sm sm:text-base md:text-lg">
            我的博客
          </span>
        </NuxtLink>

        <!-- 桌面端：中间导航（md 断点及以上显示，768px 起，iPad 竖屏够用） -->
        <nav class="hidden md:flex items-center gap-1.5 flex-1 justify-center min-w-0">
          <NuxtLink
            v-for="item in navItems"
            :to="item.to"
            :key="item.to"
            class="px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap
                   hover:text-indigo-600 dark:hover:text-indigo-300
                   hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                   transition-all duration-200"
            :class="{ 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10': route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- 桌面端右侧：搜索框 + 主题切换（md 及以上 = 768px，iPad 竖屏就有完整顶部导航） -->
        <div class="hidden md:flex items-center gap-2 shrink-0">
          <div ref="searchWrapperRef" class="relative">
            <label class="flex items-center gap-2 w-64 px-3.5 py-2 rounded-full
                         bg-slate-100 dark:bg-slate-900/80
                         border border-slate-200 dark:border-slate-800
                         text-slate-500 dark:text-slate-400
                         hover:border-indigo-300 dark:hover:border-indigo-600
                         focus-within:border-indigo-400 dark:focus-within:border-indigo-500
                         focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-500/20
                         transition-all duration-200 cursor-text">
              <Icon name="ph:magnifying-glass-bold" class="w-4 h-4 shrink-0" />
              <input
                ref="desktopSearchInput"
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                aria-label="搜索文章"
                class="flex-1 bg-transparent border-0 outline-none text-sm min-w-0
                       text-slate-800 dark:text-slate-200
                       placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </label>
            <SearchResults v-if="searchQuery.trim()" :results="searchResults" @select="onSearchResultSelect" />
          </div>

          <button
            :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
            class="flex h-10 w-10 items-center justify-center rounded-full shrink-0
                   text-slate-600 dark:text-slate-300
                   hover:text-indigo-600 dark:hover:text-indigo-300
                   hover:bg-slate-100 dark:hover:bg-slate-800/60
                   transition-all duration-200"
          >
            <Icon v-if="theme === 'dark'" name="ph:sun-bold" class="w-5 h-5" />
            <Icon v-else name="ph:moon-bold" class="w-5 h-5" />
          </button>
        </div>

        <!-- 窄屏工具栏（md 以下，<768px：仅真正的手机尺寸才用窄屏布局）
             优先级：菜单必保 > 主题必保 > 搜索框(≥380px才显示，可被压缩) -->
        <div class="flex md:hidden items-center gap-1.5 sm:gap-2 min-w-0 justify-end shrink-0">
          <!-- 窄屏搜索框：屏宽≥380px才显示；380px以下直接隐藏，把空间让给标题、主题、菜单
               display/flex/position 规则用 scoped CSS 的 @media 写，
               绕开 lightningcss 无法解析 Tailwind "[@media(...)]:xxx" 任意媒体查询的 bug -->
          <div ref="mobileSearchWrapperRef"
               class="mobile-search-wrap
                      min-w-[7rem] sm:min-w-[10rem] max-w-[11rem] sm:max-w-[15rem]">
            <label class="flex items-center gap-1.5 sm:gap-2 w-full px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full
                         bg-slate-100 dark:bg-slate-900/80
                         border border-slate-200 dark:border-slate-800
                         text-slate-500 dark:text-slate-400
                         hover:border-indigo-300 dark:hover:border-indigo-600
                         focus-within:border-indigo-400 dark:focus-within:border-indigo-500
                         focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-500/20
                         transition-all duration-200 cursor-text">
              <Icon name="ph:magnifying-glass-bold" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <input
                ref="mobileSearchInput"
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                aria-label="搜索文章"
                class="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm min-w-0
                       text-slate-800 dark:text-slate-200
                       placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </label>
            <SearchResults v-if="searchQuery.trim()" :results="searchResults" @select="onSearchResultSelect" />
          </div>

          <!-- 主题切换按钮（始终保留） -->
          <button
            :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
            class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full shrink-0
                   text-slate-600 dark:text-slate-300
                   hover:text-indigo-600 dark:hover:text-indigo-300
                   hover:bg-slate-100 dark:hover:bg-slate-800/60
                   transition-all duration-200"
          >
            <Icon v-if="theme === 'dark'" name="ph:sun-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
            <Icon v-else name="ph:moon-bold" class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <!-- 菜单按钮（始终保留，不隐藏）：窄屏进入分类/文章/关于的入口必须存在
               仅使用一个 list-bold 图标，通过旋转方向区分菜单状态，不替换图标 -->
          <button
            @click="menuOpen = !menuOpen"
            :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
            class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full shrink-0
                   text-slate-600 dark:text-slate-300
                   hover:text-indigo-600 dark:hover:text-indigo-300
                   hover:bg-slate-100 dark:hover:bg-slate-800/60
                   transition-all duration-200"
          >
            <Icon
              name="ph:list-bold"
              class="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ease-out"
              :class="{ 'rotate-90': menuOpen }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 窄屏（md 以下）下拉菜单（手机） —— 因为菜单按钮仅在窄屏显示 -->
    <Transition name="slide">
      <nav v-if="menuOpen" class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
        <div class="mx-auto max-w-[1200px] px-4 py-3 flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :to="item.to"
            :key="item.to"
            @click="closeMenu"
            class="px-4 py-3 rounded-xl text-base font-medium
                   text-slate-700 dark:text-slate-200
                   hover:text-indigo-600 dark:hover:text-indigo-300
                   hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                   transition-all duration-200"
            :class="{ 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10': route.path === item.to }"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false);
const route = useRoute();
const { theme, toggleTheme } = useTheme();
const {
  query: searchQuery,
  results: searchResults,
  clear: clearSearch,
} = useSearch();

const navItems = [
  { label: "首页", to: "/" },
  { label: "文章", to: "/articles" },
  { label: "分类", to: "/categories" },
  { label: "关于", to: "/about" },
];

const searchWrapperRef = ref<HTMLElement | null>(null);
const mobileSearchWrapperRef = ref<HTMLElement | null>(null);
const desktopSearchInput = ref<HTMLInputElement | null>(null);
const mobileSearchInput = ref<HTMLInputElement | null>(null);

function closeMenu() {
  menuOpen.value = false;
}

function onSearchResultSelect() {
  clearSearch();
  menuOpen.value = false;
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node;
  // 点击不在桌面搜索框内 → 清空桌面搜索
  if (
    searchWrapperRef.value &&
    !searchWrapperRef.value.contains(target)
  ) {
    clearSearch();
  }
  // 点击不在移动端搜索框内，且不在菜单内 → 同时关闭菜单
  if (
    !searchWrapperRef.value?.contains(target) &&
    !mobileSearchWrapperRef.value?.contains(target)
  ) {
    clearSearch();
  }
}

function triggerSearchShortcut() {
  // md 及以上 = 768px（iPad 竖屏起）就进入完整桌面模式，focus 桌面搜索框
  if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
    nextTick(() => {
      desktopSearchInput.value?.focus();
    });
  } else {
    // md 以下（真正手机）：直接 focus 窄屏常驻的搜索框
    nextTick(() => {
      mobileSearchInput.value?.focus();
    });
  }
}

function onkeydown(event: KeyboardEvent) {
  const target = (event.target as HTMLElement) || undefined;
  const isEditing = target && ["INPUT", "TEXTAREA"].includes(target.tagName);
  if (event.key === "Escape") {
    menuOpen.value = false;
    clearSearch();
    // 按 ESC 让搜索框失焦（避免光标还在里面）
    mobileSearchInput.value?.blur();
    desktopSearchInput.value?.blur();
  } else if (
    !isEditing &&
    (event.key === "k" || event.key === "K") &&
    (event.metaKey || event.ctrlKey)
  ) {
    event.preventDefault();
    triggerSearchShortcut();
  } else if (
    !isEditing &&
    event.key === "/" &&
    !(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
  ) {
    event.preventDefault();
    triggerSearchShortcut();
  }
}

watch(
  () => route.path,
  () => {
    closeMenu();
    clearSearch();
  },
);

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onkeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onkeydown);
});
</script>

<style lang="less" scoped>
/* 窄屏搜索框的 380px 显示阈值：
   不用 Tailwind "[@media(...)]:xxx" 任意媒体查询，lightningcss 会解析失败；
   直接用 scoped CSS 原生 @media，在 380px 以下隐藏，380px 以上显示并允许拉伸 */
.mobile-search-wrap {
  display: none;
  @media (min-width: 380px) {
    display: flex;
    position: relative;
    flex: 1 1 0%;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
