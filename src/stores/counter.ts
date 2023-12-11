import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface CounterStore {
  count: number
  doubleCount: number
  increment: () => void
}

export const useCounterStore = defineStore('counter', (): CounterStore => {
  const count = ref<number>(0)
  const doubleCount = computed<number>(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count: count.value, doubleCount: doubleCount.value, increment }
})
