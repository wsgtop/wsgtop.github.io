<template>
  <div class="relative min-h-screen">
    <div class="fixed inset-0 -z-20 bg-gray-50 dark:bg-gray-950" />
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
    <div class="relative text-gray-900 dark:text-gray-100">
      <AppHeader />
      <!-- 这里不再二次套 max-width/padding，由各页面组件自行控制容器和留白 -->
      <main class="min-h-[calc(100vh-4rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig();
const backgroundImage = appConfig.theme.backgroundImage;
</script>
