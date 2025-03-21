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
        You're currently on Basic Plan. <br />
        You will be billed ${{ selectedPrice }} {{ billingCycle }}
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
          v-model="cardName"
          maxlength="50"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Card number</label
        >
        <div class="relative">
          <input
            v-model="cardNumber"
            type="text"
            placeholder="Enter card number"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            :maxlength="cardMaxLength"
            @input="formatCardNumber"
          />
          <div class="absolute right-3 top-3 text-gray-500">
            <component :is="cardIcon" class="h-8 w-8" v-if="cardIcon" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700"
            >Expiration</label
          >
          <input
            v-model="expiration"
            type="text"
            placeholder="MM/YYYY"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            maxlength="7"
            @input="formatExpiration"
          />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input
            v-model="cvv"
            type="text"
            placeholder="Enter CVV"
            class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
            :maxlength="cvvLength"
          />
        </div>
      </div>

      <!-- Payment Button -->
      <button
        @click="handlePayment"
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5D3BEA] p-3 font-medium text-white transition hover:bg-[#4A2EBE]"
      >
        Proceed to payment: ${{ selectedPrice }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import PricingIcon from '~/assets/icons/pricing-icon.vue'
import { CreditCardIcon, BanknotesIcon } from '@heroicons/vue/24/solid'
import { useUser } from '~/composables/useUser'

const { userInfo } = useUser()
const email = computed(() => userInfo?.value.email)
const profileImage = computed(() => userInfo?.value.profileImage)
const userId = computed(() => sessionStorage.getItem('user_id'))

// Define card type icons
const cardIcons: Record<string, any> = {
  visa: CreditCardIcon,
  mastercard: BanknotesIcon,
  amex: BanknotesIcon,
  discover: BanknotesIcon
}

const route = useRoute()
const selectedPrice = ref(route.query.price || '00.00')
const billingCycle = ref(route.query.billingCycle || 'free')
const cardName = ref('')
const cardNumber = ref('')
const expiration = ref('')
const cvv = ref('')

// Compute card type based on input
const cardIcon = computed(() => {
  if (/^4/.test(cardNumber.value)) return cardIcons.visa // Visa
  if (/^5[1-5]/.test(cardNumber.value)) return cardIcons.mastercard // MasterCard
  if (/^3[47]/.test(cardNumber.value)) return cardIcons.amex // Amex
  if (/^6(?:011|5)/.test(cardNumber.value)) return cardIcons.discover // Discover
  return null
})

// Set max length for card number
const cardMaxLength = computed(() =>
  cardIcon.value === cardIcons.amex ? 15 : 16
)

// Set CVV length based on card type
const cvvLength = computed(() => (cardIcon.value === cardIcons.amex ? 4 : 3))

// Format card number with spaces
const formatCardNumber = () => {
  cardNumber.value = cardNumber.value
    .replace(/\D/g, '')
    .slice(0, cardMaxLength.value)
}

// Format expiration date (MM/YYYY)
const formatExpiration = () => {
  expiration.value = expiration.value.replace(/\D/g, '').slice(0, 6)

  if (expiration.value.length > 2) {
    expiration.value = expiration.value.replace(/^(\d{2})(\d{0,4})$/, '$1/$2')
  }
}

// Handle payment submission
const handlePayment = async () => {
  const paymentData = {
    payerName: cardName.value,
    email: email.value,
    amountPaid: parseFloat(selectedPrice.value),
    user_id: userId.value,
    paymentDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    subscriptionPlan: billingCycle.value,
    status: 'Paid',
    profileImage: profileImage.value
  }

  try {
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/createPayment',
      paymentData
    )
    if (response.status === 200) {
      alert('Payment successful!')
    } else {
      alert('Payment failed. Please try again.')
    }
  } catch (error) {
    console.error('Error during payment:', error)
    alert('Payment failed. Please try again.')
  }
}
</script>
