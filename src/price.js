const puppeteer = require('puppeteer')

// Stock negotiation code
const ticker = 'ITSA4'

const init = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 100 })
    const page = await browser.newPage()
    await page.goto('http://google.com/')
    await page.focus('input[name="q"]')
    await page.keyboard.type(ticker, { delay: 100 })
    await page.keyboard.press('Enter')
    await page.waitFor('div .gsrt span span:first-child')
    const price = await page.$eval('div .gsrt span span:first-child', el => Number(el.innerText.split(' ')[0].replace(',', '.')))

    console.group()
      console.log('Ticker: ', ticker)
      console.log('Price: ', price)
    console.groupEnd()

    await browser.close()
  } catch(err) {
    console.error(err)
  }
}

init()