<template>
  <!-- Pricing -->
  <div
    class="mb-4 flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 lg:mb-12 dark:bg-[#1E2A5A]"
  >
    <h1
      class="text-center text-3xl font-bold text-slate-800 dark:text-gray-300"
    >
      Choose the plan that's right for you
    </h1>

    <!-- Tabs -->
    <div class="flex gap-2 rounded-full bg-gray-200 p-1 dark:bg-[#0C1438]">
      <button
        @click="billingCycle = 'monthly'"
        :class="
          billingCycle === 'monthly'
            ? 'bg-[#5D3BEA] text-white'
            : 'text-gray-600 dark:text-gray-300'
        "
        class="rounded-full px-4 py-2 font-bold"
      >
        Monthly
      </button>
      <button
        @click="billingCycle = 'yearly'"
        :class="
          billingCycle === 'yearly'
            ? 'bg-[#5D3BEA] text-white'
            : 'text-gray-600 dark:text-gray-300'
        "
        class="rounded-full px-4 py-2 font-bold"
      >
        Yearly (5% off)
      </button>
    </div>

    <div
      class="grid w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:max-w-4xl xl:grid-cols-3"
    >
      <!-- Free Plan -->
      <div
        class="w-fit rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
      >
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Free plan
        </h3>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
          $0
        </p>
        <p class="text-gray-600 dark:text-gray-300">Forever free</p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Essential features for individuals.
        </p>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Access to Quasi AI basic features
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Up to 20 AI-generated responses per
            month
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Email support
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Secure cloud storage for
            AI-generated content
          </li>
          <li>❌ Personalized AI suggestions</li>
          <li>❌ API access for seamless integration</li>
        </ul>
        <NuxtLink to="/auth/sign-up">
          <button
            class="mt-4 w-full cursor-not-allowed rounded-lg bg-gray-400 p-2 font-bold text-white"
            disabled
          >
            Current Plan
          </button>
        </NuxtLink>
      </div>

      <!-- Premium Plan -->
      <div
        class="relative w-fit rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
      >
        <LandingUiIconsPricingWords
          class="absolute -right-24 -top-4 hidden 2xl:block"
        />
        <LandingUiIconsPricingArrow
          class="absolute -right-5 -top-4 hidden 2xl:block"
        />
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Premium plan
          </h3>
          <span
            class="block rounded-full bg-[#5D3BEA] px-3 py-1 text-sm font-bold text-white 2xl:hidden"
            >Most Popular</span
          >
        </div>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
          ${{ premiumPrice }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          {{
            billingCycle === 'monthly'
              ? 'per user per month'
              : 'billed annually'
          }}
        </p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Advanced features for power users.
        </p>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Everything in Free Plan
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Up to 500 AI-generated responses
            per month
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Personalized AI suggestions
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Priority email & chat support
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> AI-powered analytics & insights
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> API access for seamless integration
          </li>
        </ul>
        <NuxtLink
          :to="`/other/pricing/payment?price=${premiumPrice}&billingCycle=${billingCycle}`"
        >
          <button
            class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white"
          >
            Upgrade
          </button>
        </NuxtLink>
      </div>

      <!-- Enterprise Plan -->
      <div
        class="w-fit rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
      >
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Enterprise plan
        </h3>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
          Custom
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          Tailored for organizations
        </p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Scalable solutions for businesses.
        </p>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Everything in Premium Plan
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Unlimited AI-generated responses
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Dedicated account manager
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> Custom AI models & integrations
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> On-premise deployment options
          </li>
          <li class="flex gap-2">
            <LandingUiIconsPricingChecked /> 24/7 priority support
          </li>
        </ul>
        <NuxtLink to="/other/support">
          <button
            class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white"
          >
            Contact Sales
          </button>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center gap-4 p-6">
      <NuxtLink to="/other/support"
        ><button
          class="mt-4 w-[200px] rounded-full border bg-white p-2 font-bold text-black"
        >
          Contact Support
        </button></NuxtLink
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
// Define billing cycle types
type BillingCycle = 'monthly' | 'yearly'

const billingCycle = ref<BillingCycle>('monthly')

const premiumPrice = computed<string>(() => {
  return billingCycle.value === 'monthly'
    ? '4.99'
    : (4.99 * 12 * 0.95).toFixed(2)
})
</script>
