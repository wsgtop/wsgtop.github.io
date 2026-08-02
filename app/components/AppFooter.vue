<template>
  <footer class="w-full border-t border-border-default bg-bg-elevated/60 backdrop-blur-sm text-fg-muted">
    <div class="mx-auto max-w-[1200px] xl:max-w-7xl px-3 sm:px-4 md:px-8 lg:px-10 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col gap-1">
          <p class="text-sm text-fg-muted">
            © {{ year }} <span class="text-fg-default font-medium">{{ siteName }}</span
            >&nbsp;·&nbsp;基于 Nuxt 4 + @nuxt/content 构建
          </p>
          <p class="text-xs text-fg-subtle">
            本博客所有原创文章采用
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blog-primary hover:underline underline-offset-2"
            >
              CC BY-NC-SA 4.0
            </a>
            &nbsp;协议进行许可
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.href"
            :title="link.name"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-elevated text-fg-subtle transition hover:border-blog-primary hover:text-blog-primary hover:shadow-sm"
          >
            <Icon :name="link.icon" class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const siteName = '我的博客'
const year = new Date().getFullYear()

const socialLinks = [
  {
    name: 'GitHub',
    icon: 'ph:github-logo-bold',
    href: 'https://github.com/wsgtop',
  },
  {
    name: 'RSS',
    icon: 'ph:rss-bold',
    href: '/rss.xml',
  },
  {
    name: 'Email',
    icon: 'ph:envelope-bold',
    href: 'mailto:hello@example.com',
  },
]
</script>
