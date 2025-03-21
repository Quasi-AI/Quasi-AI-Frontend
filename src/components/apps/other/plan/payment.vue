<template>
  <div class="w-full rounded-lg bg-white p-6 shadow-lg dark:bg-[#111C44]">
    <!-- Header -->
    <div
      class="rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 p-4 text-center text-white"
    >
      <div class="mb-2 flex items-center justify-center">
        <PricingIcon class="h-8 w-8" />
      </div>
      <h2 class="text-lg font-semibold">
        You're currently on Basic Plan. You will be billed GHS
        {{ selectedPrice }}
        every month
      </h2>
      <p class="text-sm opacity-80">You can cancel any time</p>
    </div>

    <!-- Form -->
    <div class="mt-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Enter name of card"
          class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Card number
        </label>
        <div class="relative">
          <input
            v-model="cardNumber"
            type="text"
            placeholder="Enter card number"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          />
          <div class="absolute right-3 top-3 text-gray-500">
            <component :is="cardIcon" class="h-8 w-8" v-if="cardIcon" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Expiration
          </label>
          <input
            type="text"
            placeholder="MM/YYYY"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input
            type="text"
            placeholder="Enter secret number"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          />
        </div>
      </div>

      <!-- Payment Button -->
      <button
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5D3BEA] p-3 font-bold text-white"
      >
        Proceed to payment : GHS {{ selectedPrice }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PricingIcon from '~/assets/icons/pricing-icon.vue'
import { CreditCardIcon, BanknotesIcon } from '@heroicons/vue/24/solid'

// Define icons for different card types
const cardIcons: Record<string, any> = {
  visa: CreditCardIcon,
  mastercard: BanknotesIcon,
  amex: BanknotesIcon,
  discover: BanknotesIcon
}

const route = useRoute()
const selectedPrice = ref(route.query.price || '00.00')
const cardNumber = ref('')

// Compute card type based on input
const cardIcon = computed(() => {
  if (/^4/.test(cardNumber.value)) return cardIcons.visa // Visa
  if (/^5[1-5]/.test(cardNumber.value)) return cardIcons.mastercard // MasterCard
  if (/^3[47]/.test(cardNumber.value)) return cardIcons.amex // Amex
  if (/^6(?:011|5)/.test(cardNumber.value)) return cardIcons.discover // Discover
  return null
})
</script>
