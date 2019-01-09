const puppeteer = require('puppeteer')

const ticker = 'BNFS11'

const init = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`https://fiis.com.br/${ticker}/?aba=geral`, { timeout: 0 })
    
    const sector = await page.$eval('table tr:nth-child(2) td:nth-child(2)', el => el.innerText.split(':')[1].trim())

    await page.goto(`https://fiis.com.br/${ticker}/?aba=indicadores`, { timeout: 0 })

    const dividendYieldAnual = await page.$eval('table tr:nth-child(4) td', el => {
      const element = el.innerText
      console.log('element', element)

      const dividend = element.split(/\n/)[1]

      return Number(dividend.replace('Rendimento % médio 12 meses: ', '').replace('%', '').replace(',', '.'))/100
    })

    const equity = await page.$eval('table tr:nth-child(12) td', el => {
      const element = el.innerText
      const coinIndex = element.indexOf('R$')

      const net = element.split(/\n/)[0]

      return Number(net.substr(coinIndex).replace('R$', '').replace('*', '').replace('.', '').replace(',', '.').trim())
    })

    await page.goto('http://google.com/')
    await page.focus('input[name="q"]')
    await page.keyboard.type(ticker, { delay: 100 })
    await page.keyboard.press('Enter')
    await page.waitFor('div .gsrt span span:first-child')
    const price = await page.$eval('div .gsrt span span:first-child', el => Number(el.innerText.split(' ')[0].replace(',', '.')))

    console.group()
      console.log('Ticker:', ticker)
      console.log('Sector:', sector)
      console.log('Equity:', equity)
      console.log('Price:', price)
      console.log('Dividend Yield:', dividendYieldAnual)
    console.groupEnd()

    await browser.close()
  } catch(err) {
    console.error(err)
  }
}

init()