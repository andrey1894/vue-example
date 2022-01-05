const API_KEY = '3c471c6eab03123959fdc7736561654c84797bef9a63ba964a72e9c5a33c8ae1'
const AGGREGATE_INDEX = 5

const tickerHandlers = new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const sendToWs = (dataMessage) => {
  const message = JSON.stringify(dataMessage)
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message)
    return
  }

  socket.addEventListener(
    'open',
    () => {
      socket.send(message)
    },
    { once: true }
  )
}

const subscribeTickerWs = (tickerName) => {
  const message = {
    action: 'SubAdd',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  }

  sendToWs(message)
}

const unsubscribeTickerWs = (tickerName) => {
  const message = {
    action: 'SubRemove',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  }

  sendToWs(message)
}

socket.addEventListener('message', (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data)

  if (+type === AGGREGATE_INDEX && newPrice !== undefined) {
    const handlers = tickerHandlers.get(currency) ?? []
    handlers.forEach((fn) => fn(newPrice))
  }
})

export const loadTicker = (tickerNames) =>
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerNames.join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then((r) => r.json())
    .then((rawData) => Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD])))

export const subscribeTicker = (tickerName, cb) => {
  const subscribers = tickerHandlers.get(tickerName) || []
  tickerHandlers.set(tickerName, [...subscribers, cb])
  subscribeTickerWs(tickerName)
}

export const unsubscribeTicker = (tickerName) => {
  tickerHandlers.delete(tickerName)
  unsubscribeTickerWs(tickerName)
}

window.tickers = tickerHandlers
