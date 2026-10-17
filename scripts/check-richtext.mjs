/**
 * Renders <RichText> to static HTML and asserts the words are separated
 * by real spaces. This is the check that catches the "I'macybersecurity
 * analystandPyth..." run-together bug — it regressed twice because both
 * times the space was a trailing node inside an inline-block, where CSS
 * collapses it away.
 *
 * Run: node scripts/check-richtext.mjs
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { build } from 'esbuild'
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'

// forward slashes — esbuild treats backslashes in the import as escapes
const MOTION = process.cwd().replace(/\\/g, '/') + '/src/components/primitives/motion.jsx'

const entry = `
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RichText } from '${MOTION}'

const SAMPLE = "I'm a cyber security analyst and Python developer based in Patiala, India."

const html = renderToStaticMarkup(createElement(RichText, { text: SAMPLE }))
console.log(html)
`

// The build output must live INSIDE the project so Node can resolve
// react / react-dom from ./node_modules.
const dir = mkdtempSync(join(process.cwd(), '.richtext-check-'))
const entryFile = join(dir, 'entry.jsx')
const outFile = join(dir, 'out.mjs')
writeFileSync(entryFile, entry)

await build({
  entryPoints: [entryFile],
  bundle: true,
  outfile: outFile,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  loader: { '.jsx': 'jsx' },
  external: ['react', 'react-dom', 'framer-motion'],
  logLevel: 'error',
})

const { execSync } = await import('node:child_process')
const html = execSync(`node ${JSON.stringify(outFile)}`, { encoding: 'utf8' })

// clean up the temp build folder
rmSync(dir, { recursive: true, force: true })

// strip the tags, leaving the visible characters
const visible = html
  .replace(/<[^>]+>/g, '')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .trim()

const EXPECTED = "I'm a cyber security analyst and Python developer based in Patiala, India."

console.log('---')
console.log('rendered :', JSON.stringify(visible))
console.log('expected :', JSON.stringify(EXPECTED))

if (visible === EXPECTED) {
  console.log('\nPASS - words are correctly space-separated.')
} else {
  console.log('\nFAIL - text does not match.')
  process.exitCode = 1
}
