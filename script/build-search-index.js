import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles')
const OUT_PATH = path.join(process.cwd(), 'public', 'search-index.json')

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = /^---\n([\s\S]*?)\n---/.exec(normalized)
  if (!match) return {}
  const fields = {}
  for (const line of match[1].split('\n')) {
    const kv = /^(\w+):\s*(.*)$/.exec(line)
    if (!kv) continue
    const [, key, value] = kv
    if (value.startsWith('[')) {
      fields[key] = [...value.matchAll(/"([^"]*)"/g)].map(m => m[1])
    } else {
      fields[key] = value.replace(/^"(.*)"$/, '$1')
    }
  }
  return fields
}

const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))

const index = files.map((file) => {
  const raw = readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
  const { title = '', category = '', description = '', tags = [] } = parseFrontmatter(raw)
  const slug = file.replace(/\.md$/, '')
  return { title, path: `/articles/${slug}`, category, tags, description }
})

mkdirSync(path.dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, JSON.stringify(index, null, 2))
console.log(`已生成 ${index.length} 条搜索索引 -> ${path.relative(process.cwd(), OUT_PATH)}`)