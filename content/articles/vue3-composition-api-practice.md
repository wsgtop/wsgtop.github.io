---
title: Vue 3 组合式 API 实战：从选项式到 Composition 的迁移指南
date: 2026-07-28
category: Vue 3
tags: [Vue 3, Composition API, 前端]
description: 详细介绍 Vue 3 组合式 API 的核心理念与实战用法，对比选项式 API 的差异，并提供渐进式迁移的最佳实践。
---

# Vue 3 组合式 API 实战

Vue 3 引入的组合式 API（Composition API）彻底改变了我们组织组件逻辑的方式。相比选项式 API，组合式 API 提供了更灵活的代码复用、更清晰的类型推断，以及更好的大型组件可维护性。

## 为什么需要组合式 API？

在选项式 API 中，我们将逻辑分散在 `data`、`computed`、`methods`、`watch` 等不同选项中。当组件变得复杂时，**一个功能的代码会散落在组件的各个角落**，阅读和维护都非常困难。

```typescript
// 选项式：一个功能的代码被分散
export default {
  data() { return { count: 0, user: null } },
  computed: { doubleCount() { /* ... */ } },
  methods: { increment() { /* ... */ }, fetchUser() { /* ... */ } },
  watch: { count() { /* ... */ } }
}
```

组合式 API 让我们可以 **按功能组织代码**：

```typescript
// 组合式：一个功能的代码集中在一起
function useCounter() {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => count.value++
  watch(count, () => console.log('changed'))
  return { count, doubleCount, increment }
}

function useUser() {
  const user = ref(null)
  const fetchUser = async () => { /* ... */ }
  return { user, fetchUser }
}
```

## 核心概念解析

### 1. ref 与 reactive

`ref` 用于创建基本类型的响应式引用，访问需要通过 `.value`：

```typescript
const count = ref(0)
console.log(count.value) // 0
count.value++
```

`reactive` 用于创建对象类型的响应式代理，**不需要** `.value`：

```typescript
const state = reactive({ name: 'Alice', age: 18 })
console.log(state.name) // Alice
state.age++
```

> 💡 **何时用哪个？** 基本类型（数字、字符串、布尔）用 `ref`，复杂对象用 `reactive`。不确定时用 `ref` 更安全。

### 2. computed 计算属性

计算属性会自动追踪其依赖的响应式状态，并缓存结果：

```typescript
const firstName = ref('张')
const lastName = ref('三')

// 只读 computed
const fullName = computed(() => `${firstName.value}${lastName.value}`)

// 可写 computed
const writableFullName = computed({
  get: () => `${firstName.value}${lastName.value}`,
  set: (val) => {
    [firstName.value, lastName.value] = [val[0], val.slice(1)]
  }
})
```

### 3. watch 与 watchEffect

`watch` 需要显式指定监听的源：

```typescript
// 监听 ref
watch(count, (newVal, oldVal) => console.log(`${oldVal} → ${newVal}`))

// 监听 reactive 的某个属性
watch(() => state.age, (age) => console.log('age:', age))

// 多源监听
watch([count, firstName], ([newC, newF]) => { /* ... */ })
```

`watchEffect` 会自动追踪执行过程中访问到的响应式依赖：

```typescript
watchEffect(() => {
  console.log(`count=${count.value}, name=${firstName.value}`)
})
// 任何依赖变化时都会重新执行
```

### 4. 生命周期钩子

| 选项式 API     | 组合式 API (onXxx) |
| -------------- | ----------------- |
| beforeCreate   | 直接写在 setup 里 |
| created        | 直接写在 setup 里 |
| beforeMount    | onBeforeMount     |
| mounted        | onMounted         |
| beforeUpdate   | onBeforeUpdate    |
| updated        | onUpdated         |
| beforeUnmount  | onBeforeUnmount   |
| unmounted      | onUnmounted       |

## 实战：封装一个 useLocalStorage composable

组合式 API 最强的能力之一是 **逻辑复用**。让我们写一个持久化存储到 localStorage 的 composable：

```typescript
// composables/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初始化：从 localStorage 读取
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : initialValue) as Ref<T>

  // 数据变化时自动保存
  watch(
    data,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal))
    },
    { deep: true } // 深度监听对象/数组
  )

  // 提供手动清理方法
  const clear = () => {
    localStorage.removeItem(key)
    data.value = initialValue
  }

  return { data, clear }
}
```

在任意组件中使用：

```vue
<script setup lang="ts">
const { data: settings, clear: resetSettings } = useLocalStorage('user-settings', {
  theme: 'light',
  language: 'zh-CN',
  fontSize: 14
})
</script>

<template>
  <p>当前主题：{{ settings.theme }}</p>
  <button @click="settings.theme = 'dark'">切换深色</button>
  <button @click="resetSettings">重置</button>
</template>
```

## 迁移建议

1. **不需要重写**：选项式 API 依然完全可用，新项目可以直接用组合式。
2. **渐进式迁移**：先将复杂逻辑抽成 composable，再逐步替换组件内部写法。
3. **保留选项式的场景**：简单展示组件（props 进、render 出）用选项式代码更短。
4. **搭配 `<script setup>`**：这是组合式 API 的语法糖，少写大量样板代码，强烈推荐。

组合式 API 不是选项式的替代品，而是 **超集** —— 它解决了选项式在复杂场景下的痛点，同时保留了 Vue 的简洁与优雅。掌握它，你的 Vue 开发体验会更上一层楼 🚀
