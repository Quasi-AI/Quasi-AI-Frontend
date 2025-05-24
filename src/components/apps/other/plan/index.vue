<template>
  <!-- Pricing -->
  <div
    class="mb-4 flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 dark:bg-[#1E2A5A] lg:mb-12"
  >
    <h1
      class="text-center text-3xl font-bold text-slate-800 dark:text-gray-300"
    >
      Choose the plan that's right for you
    </h1>

    <!-- Tabs -->
    <div class="mb-4 flex gap-2 rounded-full bg-gray-200 p-1 dark:bg-[#0C1438]">
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
        Yearly (Save 20%)
      </button>
    </div>

    <div class="flex flex-col items-center justify-center px-4">
      <div class="grid w-full gap-6 md:grid-cols-2 lg:max-w-5xl xl:grid-cols-3">
        <!-- Basic Plan -->
        <div
          class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
        >
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Basic Plan
          </h3>
          <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            $0
          </p>
          <p class="text-gray-600 dark:text-gray-300">Forever free</p>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Perfect for casual learners to explore Quasi AI.
          </p>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Generate up to 5 flashcard sets</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>50 AI-generated responses monthly</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Basic email support</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>1GB cloud storage for notes</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 text-red-500">❌</span>
              <span>No access to AI tutors</span>
            </li>
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

        <!-- Premium Plan - Most Popular -->
        <div
          class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-xl ring-2 ring-[#5D3BEA] transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
        >
          <div
            class="absolute right-0 top-0 -mt-4 mr-4 rounded-full bg-[#5D3BEA] px-3 py-1 text-sm font-bold text-white"
          >
            Most Popular
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Premium Plan
          </h3>
          <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            ${{ premiumPrice }}
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            {{
              billingCycle === 'monthly'
                ? 'per user per month'
                : 'billed annually (save $12)'
            }}
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Ideal for dedicated students & educators.
          </p>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span><strong>Unlimited</strong> flashcard sets</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span><strong>Unlimited</strong> AI-generated responses</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>AI tutors for personalized learning</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Advanced analytics & insights</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>10GB smart cloud storage</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Priority email support</span>
            </li>
          </ul>
          <NuxtLink
            :to="`/other/pricing/payment?price=${premiumPrice}&billingCycle=${billingCycle}`"
          >
            <button
              class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white hover:bg-[#4A2FCB]"
            >
              Upgrade
            </button>
          </NuxtLink>
        </div>

        <!-- Enterprise Plan -->
        <div
          class="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
        >
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Enterprise Plan
          </h3>
          <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            Custom
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            Designed for educational institutions
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Complete solution for schools & universities.
          </p>
          <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Everything in Premium Plan</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Custom AI models for your curriculum</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Bulk user management</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>LMS integrations & API access</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>Dedicated account manager</span>
            </li>
            <li class="flex gap-2">
              <div>
                <LandingUiIconsPricingChecked />
              </div>
              <span>24/7 priority support</span>
            </li>
          </ul>
          <NuxtLink to="/other/support">
            <button
              class="mt-4 w-full rounded-lg bg-[#5D3BEA] p-2 font-bold text-white hover:bg-[#4A2FCB]"
            >
              Contact Sales
            </button>
          </NuxtLink>
        </div>
      </div>
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
    : (4.99 * 12 * 0.8).toFixed(2) // 20% discount for yearly
})
</script>
