<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700">Тикер</label>
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            type="text"
            name="wallet"
            id="wallet"
            v-model="tickerName"
            @input="isExistTickerError = false"
            @keydown.enter="addTicker()"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div v-show="similarTickerNames?.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <button
            v-for="name in similarTickerNames"
            :key="name"
            @click="selectSimilarTicker(name)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ name }}
          </button>
        </div>
        <div v-show="isExistTickerError" class="text-sm text-red-600">Такой тикер уже добавлен</div>
      </div>
    </div>
    <add-btn @click="addTicker()"></add-btn>
  </section>
</template>
<script>
import AddBtn from './AddBtn.vue'

export default {
  components: {
    AddBtn,
  },

  props: {
    tickers: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    coinList: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },

  emits: {
    addTicker: (v) => typeof v === 'string' && v.length,
  },

  data() {
    return {
      tickerName: '',
      isExistTickerError: false,
    }
  },

  computed: {
    similarTickerNames() {
      const similarTickerNames = []
      if (!this.tickerName) {
        return similarTickerNames
      }

      for (let i = 0, count = 0; i < this.coinList.length && count < 5; i++) {
        if (this.coinList[i].includes(this.tickerName.toUpperCase())) {
          similarTickerNames.push(this.coinList[i])
          count++
        }
      }
      return similarTickerNames
    },
  },

  methods: {
    addTicker() {
      if (this.tickers.find((t) => t.name === this.tickerName)) {
        this.isExistTickerError = true
        return
      }

      this.isExistTickerError = false
      this.$emit('addTicker', this.tickerName)
      this.tickerName = ''
    },

    selectSimilarTicker(tickerName) {
      this.tickerName = tickerName
      this.addTicker()
    },
  },
}
</script>

<style></style>
