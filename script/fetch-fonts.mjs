// 一次性脚本：手动自托管 Google Fonts（绕过 @nuxt/fonts 的联网元数据请求，适配企业代理自签名证书环境）
// 用法：node scripts/fetch-fonts.mjs
import { execFile, execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const CONCURRENCY = 6

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
const ROOT = path.join(process.cwd(), 'public', 'fonts')

const families = [
  { name: 'Inter', slug: 'inter', weights: [400, 700], allowedSubsets: ['latin', 'latin-ext'] },
  { name: 'Noto Sans SC', slug: 'noto-sans-sc', weights: [400], allowedSubsets: null },
  { name: 'Noto Serif SC', slug: 'noto-serif-sc', weights: [400], allowedSubsets: null },
  { name: 'JetBrains Mono', slug: 'jetbrains-mono', weights: [400], allowedSubsets: ['latin', 'latin-ext'] },
]

function fetchCss(name, weights) {
  const familyParam = `${name.replace(/ /g, '+')}:wght@${weights.join(';')}`
  const url = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`
  return execFileSync('curl', ['-s', '-A', UA, url], { maxBuffer: 1024 * 1024 * 50 }).toString()
}

function parseBlocks(css) {
  const blocks = []
  const re = /(?:\/\*\s*([\w-]+)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g
  let m
  while ((m = re.exec(css))) {
    const [, subset, body] = m
    const weight = /font-weight:\s*(\d+)/.exec(body)?.[1]
    const urlMatch = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/.exec(body)
    const unicodeRange = /unicode-range:\s*([^;]+);/.exec(body)?.[1]
    if (!weight || !urlMatch) continue
    blocks.push({ subset: subset || null, weight, url: urlMatch[1], unicodeRange })
  }
  return blocks
}

for (const family of families) {
  console.log(`==> ${family.name}`)
  const css = fetchCss(family.name, family.weights)
  let blocks = parseBlocks(css)
  if (family.allowedSubsets) {
    blocks = blocks.filter(b => family.allowedSubsets.includes(b.subset))
  }
  console.log(`   ${blocks.length} font-face blocks to download`)

  const outDir = path.join(ROOT, family.slug)
  const filesDir = path.join(outDir, 'files')
  mkdirSync(filesDir, { recursive: true })

  const cssLines = []
  const counters = {}
  const jobs = blocks.map((block) => {
    const w = block.weight
    counters[w] = (counters[w] || 0) + 1
    const filename = `${family.slug}-${w}-${counters[w]}.woff2`
    return { block, w, filename }
  })

  async function runJob({ block, w, filename }) {
    const filePath = path.join(filesDir, filename)
    if (existsSync(filePath) && statSync(filePath).size > 0) return { block, w, filename }
    await execFileAsync('curl', ['-sL', '--max-time', '20', '--retry', '5', '--retry-delay', '1', '--retry-all-errors', '-o', filePath, block.url])
    return { block, w, filename }
  }

  const results = []
  for (let i = 0; i < jobs.length; i += CONCURRENCY) {
    const batch = jobs.slice(i, i + CONCURRENCY)
    const done = await Promise.all(batch.map(runJob))
    results.push(...done)
    console.log(`   downloaded ${Math.min(i + CONCURRENCY, jobs.length)}/${jobs.length}`)
  }

  for (const { block, w, filename } of results) {
    cssLines.push(block.subset ? `/* ${block.subset} */` : '')
    cssLines.push('@font-face {')
    cssLines.push(`  font-family: '${family.name}';`)
    cssLines.push('  font-style: normal;')
    cssLines.push(`  font-weight: ${w};`)
    cssLines.push('  font-display: swap;')
    cssLines.push(`  src: url('./files/${filename}') format('woff2');`)
    if (block.unicodeRange) cssLines.push(`  unicode-range: ${block.unicodeRange};`)
    cssLines.push('}')
  }

  const cssFilePath = path.join(outDir, `${family.slug}.css`)
  writeFileSync(cssFilePath, cssLines.filter(Boolean).join('\n') + '\n')
  console.log(`   written ${cssFilePath}`)
}

console.log('Done.')