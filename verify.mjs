import puppeteer from 'puppeteer-core'
const OUT = '/tmp/claude-1000/-home-anany-Codes-To-Do-app/6aa2c406-7a82-4180-a568-f787b1442c12/scratchpad'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(e.message))

await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' })
await sleep(650)
await page.screenshot({ path: `${OUT}/k1-loader.png` }) // mid-typewriter
await sleep(2500)
await page.screenshot({ path: `${OUT}/k2-home.png` }) // booted, settled

// hover a card for tilt + quick-delete
await page.mouse.move(860, 300)
await sleep(500)
await page.screenshot({ path: `${OUT}/k3-hover.png` })

// toggle to the other theme
await page.evaluate(() => {
  document.querySelectorAll('.icon-btn').forEach((b) => {
    if (b.title === 'Toggle theme') b.click()
  })
})
await sleep(1000)
await page.screenshot({ path: `${OUT}/k4-theme2.png` })

console.log('errors:', errors.length ? errors.join('\n') : 'none')
await browser.close()
