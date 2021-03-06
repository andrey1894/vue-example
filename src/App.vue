<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div v-show="showLoader" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div class="container">
      <add-ticker :tickers="tickers" :coin-list="coinList" @add-ticker="addTicker"></add-ticker>

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          Фильтр: <input type="text" v-model="filter" />
          <button
            type="button"
            @click="page -= 1"
            :disabled="page < 2"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Назад
          </button>
          {{ page }}
          <button
            type="button"
            @click="page += 1"
            :disabled="!hasNextPage"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Вперёд
          </button>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            @click="selectTicker(t)"
            v-for="t in paginatedTickers"
            :key="t"
            :class="{ 'border-4': currentTicker === t }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">{{ t.name }} - USD</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ formatPrice(t.price) }}</dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteTicker(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#718096" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section class="relative" v-if="currentTicker">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">{{ currentTicker.name }} - USD</h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64" ref="graph">
          <div v-for="(bar, i) in normalizedGraph" :key="i" :style="{ height: `${bar}%` }" class="bg-purple-800 border w-10 h-24">{{ bar }}</div>
        </div>
        <button type="button" class="absolute top-0 right-0" @click="currentTicker = null">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeTicker, unsubscribeTicker } from './api'
import AddTicker from './components/AddTicker.vue'

export default {
  name: 'App',

  components: {
    AddTicker,
  },

  data() {
    return {
      showLoader: true,
      coinList: [],
      tickers: [],
      graph: [],
      currentTicker: null,
      isExistTickerError: false,

      page: 1,
      filter: '',
      total: 4,

      maxGraphElements: 0,
    }
  },
  async created() {
    const filterData = Object.fromEntries(new URL(window.location).searchParams.entries())
    this.filter = filterData.filter || ''
    this.page = +filterData.page || 1

    const res = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true`)
    const data = await res.json()
    this.coinList = Object.keys(data.Data).sort()
    this.showLoader = false
    try {
      const tickers = JSON.parse(localStorage.getItem('tickers'))
      this.tickers = Array.isArray(tickers) ? tickers : []
      this.tickers.forEach((t) => {
        subscribeTicker(t.name, (price) => this.updateTicker(t.name, price))
      })
    } catch {
      this.tickers = []
    }
  },

  mounted() {
    window.addEventListener('resize', this.calculateMaxGraphElements)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.calculateMaxGraphElements)
  },

  computed: {
    startPageIndex() {
      return (this.page - 1) * this.total
    },

    endPageIndex() {
      return this.page * this.total
    },

    filteredTickers() {
      const tickers = this.tickers.filter(({ name }) => name.includes(this.filter.toUpperCase()))
      return tickers
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startPageIndex, this.endPageIndex)
    },

    hasNextPage() {
      console.log('this.filteredTickers', this.filteredTickers)
      return this.filteredTickers.length > this.endPageIndex
    },

    normalizedGraph() {
      const maxVal = Math.max(...this.graph)
      const minVal = Math.min(...this.graph)

      return maxVal === minVal ? this.graph.map(() => 50) : this.graph.map((price) => (5 + ((price - minVal) * 95) / (maxVal - minVal)).toFixed(1))
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      }
    },
  },

  watch: {
    currentTicker() {
      this.graph = []
      this.$nextTick().then(this.calculateMaxGraphElements)
    },

    tickers() {
      localStorage.setItem('tickers', JSON.stringify(this.tickers))
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page--
      }
    },

    filter() {
      this.page = 1
    },

    pageStateOptions(v) {
      window.history.pushState(null, document.title, `${window.location.pathname}?filter=${v.filter}&page=${v.page}`)
    },
  },

  methods: {
    updateTicker(tickerName, price) {
      const ticker = this.tickers.find((t) => t.name === tickerName)
      if (ticker) {
        ticker.price = price
        if (ticker === this.currentTicker) {
          this.graph.push(ticker.price)
          if (this.graph.length > this.maxGraphElements) {
            this.graph.splice(0, this.graph.length - this.maxGraphElements)
          }
        }
      }
    },

    selectTicker(ticker) {
      this.currentTicker = ticker
    },

    addTicker(tickerName) {
      if (!tickerName) {
        console.log('empty ticker')
        return
      }

      this.filter = ''
      const ticker = {
        name: tickerName,
        price: '-',
      }
      this.tickers = [...this.tickers, ticker]
      subscribeTicker(ticker.name, (price) => this.updateTicker(ticker.name, price))
    },

    deleteTicker(ticker) {
      this.tickers = this.tickers.filter((t) => t !== ticker)

      if (this.currentTicker === ticker) {
        this.currentTicker = null
      }

      unsubscribeTicker(ticker.name)
    },

    formatPrice(price) {
      return typeof price !== 'number' ? '-' : price > 1 ? price.toFixed(2) : price.toPrecision(2)
    },

    calculateMaxGraphElements() {
      if (this.$refs.graph) {
        this.maxGraphElements = this.$refs.graph.clientWidth / 38
      }

      console.log(this.maxGraphElements)
    },
  },
}
</script>
