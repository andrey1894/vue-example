const API_KEY = '3c471c6eab03123959fdc7736561654c84797bef9a63ba964a72e9c5a33c8ae1'

const tickerHandlers = new Map()

export const loadTickers = () => {
  if (!tickerHandlers.size) {
    return
  }

  const tickerNames = [...tickerHandlers.keys()]
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerNames.join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD]))

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickerHandlers.get(currency) ?? []
        handlers.forEach((fn) => fn(newPrice))
      })
    })
}

export const loadTicker = (tickerNames) =>
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerNames.join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then((r) => r.json())
    .then((rawData) => Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD])))

export const subscribeTicker = (tickerName, cb) => {
  const subscribers = tickerHandlers.get(tickerName) || []
  tickerHandlers.set(tickerName, [...subscribers, cb])
}

export const unsubscribeTicker = (tickerName) => {
  tickerHandlers.delete(tickerName)
}

window.tickers = tickerHandlers
