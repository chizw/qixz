import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' })
const page = await browser.newPage()
await page.goto('http://localhost:3001/2025/joemg1', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

const pre = await page.$('figure.z-codeblock pre.shiki')
if (pre) {
  const html = await pre.evaluate(el => el.outerHTML)
  const styles = await pre.evaluate(el => ({
    backgroundColor: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
    maxHeight: getComputedStyle(el).maxHeight,
    height: getComputedStyle(el).height,
  }))
  console.log('STYLES:', JSON.stringify(styles))
  console.log('INLINE STYLE:', await pre.evaluate(el => el.getAttribute('style')))

  const bgRule = await pre.evaluate(el => {
    const rules = Array.from(document.styleSheets).flatMap((s) => {
      try { return Array.from(s.cssRules) } catch { return [] }
    })
    const matched = rules.filter((r) => {
      if (!(r instanceof CSSStyleRule)) return false
      try { return el.matches(r.selectorText) && r.style.backgroundColor } catch { return false }
    }).map(r => ({ selector: r.selectorText, bg: r.style.backgroundColor, cssText: r.cssText }))
    return matched
  })
  console.log('BG RULES:', JSON.stringify(bgRule))
  console.log('HTML:', html.slice(0, 2000))

  const firstLine = await page.$('figure.z-codeblock pre.shiki .line')
  if (firstLine) {
    const lineStyles = await firstLine.evaluate(el => ({
      backgroundColor: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      beforeContent: getComputedStyle(el, '::before').content,
      beforeBackground: getComputedStyle(el, '::before').backgroundColor,
      beforeColor: getComputedStyle(el, '::before').color,
    }))
    console.log('LINE STYLES:', JSON.stringify(lineStyles))
  }
} else {
  console.log('Code block not found')
}

await browser.close()
