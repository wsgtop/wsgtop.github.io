<template>
  <!-- sticky footer 结构：min-h-screen + flex-col + footer mt-auto → 内容少贴底、内容多滚到底 -->
  <div class="relative flex min-h-screen flex-col">
    <!-- 后景层：画布底色 + 两枚径向光晕（左上靛蓝 + 右下紫色，深浅自动切换 CSS 变量） -->
    <div
      class="fixed inset-0 -z-20 bg-bg-canvas"
      :style="{
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 20% 20%, var(--glow-primary), transparent 60%)',
          'radial-gradient(ellipse 60% 40% at 80% 90%, var(--glow-secondary), transparent 60%)'
        ].join(', '),
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }"
    />
    <template v-if="backgroundImage?.path">
      <div
        class="fixed inset-0 -z-10 bg-cover bg-center"
        :style="{
          backgroundImage: `url(${backgroundImage.path})`,
          filter: `saturate(${backgroundImage.saturate})`,
        }"
      />
      <div
        class="fixed inset-0 -z-10 bg-white dark:hidden"
        :style="{ opacity: backgroundImage.overlayOpacity }"
      />
    </template>

    <!-- 前景层：统一使用语义化前景色 -->
    <div class="relative flex flex-1 flex-col text-fg-default">
      <AppHeader />
      <!-- 这里不再二次套 max-width/padding，由各页面组件自行控制容器和留白；
           flex-1 保证 main 区域撑开推底 footer -->
      <main class="flex-1">
        <slot />
      </main>
      <!-- mt-auto：当 flex-1 内容不足一屏时把 footer 推到视口底；内容多时跟随末尾 -->
      <AppFooter class="mt-auto" />
    </div>
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig();
const backgroundImage = appConfig.theme.backgroundImage;
</script>
