<template>
  <div class="w-full rounded-lg bg-white p-6 shadow-lg dark:bg-[#111C44]">
    <!-- Header -->
    <div
      class="rounded-lg bg-gradient-to-r from-[#5D3BEA] to-purple-500 p-4 text-center text-white"
    >
      <div class="mb-2 flex items-center justify-center">
        <PricingIcon class="h-8 w-8" />
      </div>
      <h2 class="text-lg font-semibold">
        You're upgrading to Premium Plan <br />
        <span class="mt-1 block text-xl">
          ${{ selectedPrice }} {{ billingCycleName }}
        </span>
      </h2>
      <p class="mt-1 text-sm opacity-90">
        {{
          billingCycle === 'yearly'
            ? 'Save 20% with annual billing'
            : 'Monthly billing'
        }}
        · Cancel anytime
      </p>
    </div>

    <!-- Form -->
    <div class="mt-6 space-y-4">
      <!-- Summary Box -->
      <div
        class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#0C1438] dark:bg-[#192556]"
      >
        <h3 class="mb-2 font-medium">Subscription Summary</h3>
        <div class="flex justify-between text-sm">
          <span>Premium Plan ({{ billingCycleName }})</span>
          <span>${{ selectedPrice }}</span>
        </div>
        <div
          class="mt-1 flex justify-between text-sm text-gray-600 dark:text-gray-300"
        >
          <span>{{
            billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'
          }}</span>
          <span>{{
            billingCycle === 'yearly' ? '(20% discount applied)' : ''
          }}</span>
        </div>
        <hr class="my-3 border-gray-200 dark:border-[#0C1438]" />
        <div class="flex justify-between font-medium">
          <span>Total</span>
          <span>${{ selectedPrice }}</span>
        </div>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Name</label
        >
        <input
          type="text"
          placeholder="Enter name of card"
          class="w-full rounded-lg border p-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 dark:border-[#0C1438] dark:bg-[#111C44] dark:text-white"
          v-model="cardName"
          maxlength="50"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
        :disabled="!isFormValid"
        :class="[
          'mt-4 flex w-full items-center justify-center gap-2 rounded-lg p-3 font-medium text-white transition',
          isFormValid
            ? 'bg-[#5D3BEA] hover:bg-[#4A2EBE]'
            : 'cursor-not-allowed bg-gray-400'
        ]"
      >
        <span v-if="isProcessing">
          <svg
            class="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
        <span v-else>Complete payment: ${{ selectedPrice }}</span>
      </button>

      <p class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Your payment is secured with SSL encryption.<br />
        By proceeding you agree to our
        <a href="#" class="text-[#5D3BEA]">Terms of Service</a>
      </p>
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
const billingCycle = ref(route.query.billingCycle || 'monthly')
const billingCycleName = computed(() =>
  billingCycle.value === 'yearly' ? 'yearly' : 'per month'
)
const cardName = ref('')
const cardNumber = ref('')
const expiration = ref('')
const cvv = ref('')
const isProcessing = ref(false)

// Form validation
const isFormValid = computed(() => {
  return (
    cardName.value.length > 3 &&
    cardNumber.value.replace(/\s/g, '').length >= 15 &&
    expiration.value.length === 7 &&
    cvv.value.length >= (cvvLength.value || 3)
  )
})

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
  if (!isFormValid.value) return

  isProcessing.value = true

  const paymentData = {
    payerName: cardName.value,
    email: email.value,
    amountPaid: parseFloat(selectedPrice.value),
    user_id: userId.value,
    paymentDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    subscriptionPlan:
      billingCycle.value === 'yearly'
        ? 'Premium (Annual)'
        : 'Premium (Monthly)',
    status: 'Paid',
    profileImage: profileImage.value
  }

  try {
    const response = await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/createPayment',
      paymentData
    )
    if (response.status === 200) {
      // Redirect to success page or show success modal
      alert('Payment successful!')
      navigateTo('/dashboard')
    } else {
      alert('Payment failed. Please try again.')
    }
  } catch (error) {
    console.error('Error during payment:', error)
    alert('Payment failed. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>
