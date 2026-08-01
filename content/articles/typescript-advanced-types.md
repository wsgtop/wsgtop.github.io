---
title: TypeScript 高级类型体操：从入门到上瘾
date: 2026-07-10
category: TypeScript
tags: [TypeScript, 类型系统, 前端, 类型体操]
description: 深入解析 TypeScript 类型系统的高阶用法：条件类型、映射类型、模板字面量、infer 推断等，掌握这些你也能写出类型安全的工具库。
---

# TypeScript 高级类型体操

TypeScript 最迷人也最让人头秃的部分，莫过于它的类型系统。简单的 `interface` 和 `type` 只能满足日常开发的 80%，但如果你想写出像 `lodash`、`zod`、`trpc` 那样类型安全的工具库，就必须掌握"类型体操"。

今天我们从最基础的概念一路讲到实战，相信看完你也能看懂那些像魔法一样的类型声明 ✨

## 一、前置知识：必须掌握的基础

开始之前，确认你已经熟悉以下概念：

- **联合类型**：`A | B`
- **交叉类型**：`A & B`
- **泛型**：`type Box<T> = { value: T }`
- **keyof**：获取对象所有 key 的联合类型
- **索引访问类型**：`T[K]`
- **extends 约束**：`T extends XXX`

如果有哪个不熟悉，先花 5 分钟过一遍 TS 官方文档，再回来继续。

## 二、核心武器 1：条件类型

条件类型是类型体操的基石，语法是 JavaScript 中三目运算的"类型版本"：

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'>  // true
type B = IsString<123>      // false
type C = IsString<string[]> // false
```

### 进阶：分布式条件类型

当条件类型作用于联合类型时，会自动 **分发**（distribute）到联合的每个成员上：

```typescript
type ToArray<T> = T extends any ? T[] : never

// 联合类型会被拆解：string[] | number[] | boolean[]
type Result = ToArray<string | number | boolean>
```

利用这个特性，我们可以写出"过滤联合类型"的工具：

```typescript
type FilterString<T> = T extends string ? T : never
type X = FilterString<'a' | 1 | 'b' | 2 | true>
//   ^? type X = 'a' | 'b'    （number 和 boolean 变成 never 被消除了）
```

## 三、核心武器 2：映射类型

映射类型可以"遍历"某个类型的所有 key，生成一个新类型。语法是 `{ [K in keyof T]: ... }`：

```typescript
// 把所有属性变成可选
type Partial<T> = { [K in keyof T]?: T[K] }

// 把所有属性变成只读
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// 把所有属性变成 null 联合
type Nullable<T> = { [K in keyof T]: T[K] | null }
```

加上 `as` 子句可以重新映射 key（TS 4.1+）：

```typescript
// 给每个 key 加前缀 on，并大写首字母
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void
}

interface User { id: number; name: string }

type UserEvents = EventHandlers<User>
//   ^? {
//        onId: (value: number) => void
//        onName: (value: string) => void
//      }
```

### 小技巧：`-?` 和 `-readonly` 可以移除修饰符

```typescript
type Required<T> = { [K in keyof T]-?: T[K] }
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
```

## 四、核心武器 3：infer 推断

`infer` 是类型系统的"解构赋值"，它允许你在条件类型中 **引入一个待推断的类型变量**，这是提取类型信息的最强武器：

### 例 1：提取函数返回类型

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Add = (a: number, b: number) => number
type Sum = ReturnType<Add> // number
```

### 例 2：提取 Promise 包裹的类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T

type A = UnwrapPromise<Promise<number>>       // number
type B = UnwrapPromise<Promise<Promise<string>>> // string（递归解包）
```

### 例 3：提取数组的元素类型

```typescript
type ElementOf<T> = T extends (infer E)[] ? E : never

type Nums = ElementOf<number[]>    // number
type Strs = ElementOf<string[][]>  // string[]
```

### 例 4：提取字符串中的模式

配合模板字面量类型（下一节讲），`infer` 可以对字符串做模式匹配：

```typescript
type GetGreetingName<S> = S extends `Hello, ${infer Name}!` ? Name : never

type N = GetGreetingName<'Hello, World!'> // 'World'
```

## 五、核心武器 4：模板字面量类型

TS 4.1 引入的模板字面量类型，让字符串也能参加"类型运算"。语法和 JS 模板字符串一样，只是写在类型里：

```typescript
type Greeting<T extends string> = `Hello, ${T}!`
type HiWorld = Greeting<'World'> // 'Hello, World!'
```

当模板里传入联合类型时，会自动生成**笛卡尔积**：

```typescript
type Locale = 'en' | 'zh'
type Action = 'login' | 'logout' | 'signup'

type I18nKey = `${Locale}_${Action}`
//   ^? 'en_login' | 'en_logout' | 'en_signup'
//      | 'zh_login' | 'zh_logout' | 'zh_signup'
```

TS 还内置了 4 个字符串操作工具类型：

| 类型 | 作用 | 示例 |
| ---- | ---- | ---- |
| `Uppercase<S>` | 全大写 | `Uppercase<'abc'>` → `'ABC'` |
| `Lowercase<S>` | 全小写 | `Lowercase<'ABC'>` → `'abc'` |
| `Capitalize<S>` | 首字母大写 | `Capitalize<'hello'>` → `'Hello'` |
| `Uncapitalize<S>` | 首字母小写 | `Uncapitalize<'Hello'>` → `'hello'` |

## 六、实战：写 5 个实用工具类型

现在我们来把上面的武器组合起来，写 5 个在真实项目中非常实用的工具类型。

### 1. DeepPartial —— 深层可选

TS 内置的 `Partial` 只处理一层，对象嵌套就没用了：

```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

interface Config {
  db: { host: string; port: number; ssl: { cert: string } }
  cache: { ttl: number }
}

type PartialConfig = DeepPartial<Config>
// 所有属性（包括嵌套的 ssl.cert）都变成可选了 ✅
```

### 2. DeepReadonly —— 深层只读

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

### 3. PickByType —— 按类型挑选属性

```typescript
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

interface User { id: number; name: string; age: number; email: string }

type NumFields = PickByType<User, number>
//   ^? { id: number; age: number }
```

### 4. FunctionKeys —— 只挑出函数类型的 key

```typescript
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

interface Dog { name: string; bark(): void; wagTail(): void; age: number }

type Actions = FunctionKeys<Dog> // 'bark' | 'wagTail'
```

### 5. Paths —— 获取对象所有嵌套路径的联合

这是个稍微复杂但非常酷的例子（常用于 `get` / `set` 方法的类型）：

```typescript
type Paths<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & (string | number)]:
        | `${Prefix}${K}`
        | Paths<T[K], `${Prefix}${K}.`>
    }[keyof T & (string | number)]
  : never

interface User {
  id: number
  profile: { name: string; address: { city: string; zip: string } }
}

type UserPaths = Paths<User>
//   ^? 'id'
//      | 'profile' | 'profile.name'
//      | 'profile.address' | 'profile.address.city' | 'profile.address.zip'
```

## 七、什么时候该停下来？

类型体操虽然很酷，但也容易 **过度设计**。我的经验是：

- ✅ **值得做**：写工具库、公共组件、类型声明文件时，越精确越好
- ✅ **值得做**：核心业务逻辑层（如 API 响应类型、状态管理 store）
- ⚠️ **三思**：普通页面组件的内部类型，真的需要 `DeepUnionPartialOptional` 吗？
- ❌ **不值得**：为了炫技写自己三个月后都看不懂的类型

TypeScript 的目标是 **提升开发体验、减少运行时 Bug**，不是证明你有多聪明。够用、清晰、可维护，永远比"一行写出 10 层嵌套的魔法类型"更重要。

## 八、学习资源

想继续深入的话，推荐这几个必看资源：

1. **[Type Challenges](https://github.com/type-challenges/type-challenges)** —— 类型体操的"刷题库"，100+ 道题分 Easy/Medium/Hard/Extreme 四档，刷完 Medium 就出师了
2. **TS 官方 Handbook** 的 [Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) 章节
3. **zod**、**tRPC**、**Prisma** 的源码，看看工业界是怎么用类型的

类型体操不是一夜就能学会的，它更像一种思维方式——多练、多写、多看别人的类型定义，慢慢地你也会从"这是什么鬼"变成"哇，原来还能这么写"。祝你的类型之路，愉快且上瘾 🎯
