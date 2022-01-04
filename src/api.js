const API_KEY = '3c471c6eab03123959fdc7736561654c84797bef9a63ba964a72e9c5a33c8ae1'
export const loadTicker = (tickerNames) =>
  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerNames.join(',')}&tsyms=USD&api_key=${API_KEY}`)
    .then((r) => r.json())
    .then((rawData) => Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD])))
