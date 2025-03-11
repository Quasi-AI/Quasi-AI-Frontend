<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 dark:bg-[#1E2A5A]"
  >
    <h1 class="text-4xl font-bold text-slate-800 dark:text-gray-300">
      Choose the plan <br />
      that's right for you
    </h1>
    <div class="grid w-full max-w-3xl gap-3 sm:grid-cols-1 md:grid-cols-2">
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
        <button
          class="mt-4 w-full cursor-not-allowed rounded-lg bg-gray-400 p-2 font-bold text-white"
          disabled
        >
          Current Plan
        </button>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li>✅ Access to Quasi AI basic features</li>
          <li>✅ Up to 20 AI-generated responses per month</li>
          <li>✅ Email support</li>
          <li>✅ Secure cloud storage for AI-generated content</li>
          <li>❌ Personalized AI suggestions</li>
          <li>❌ API access for seamless integration</li>
        </ul>
      </div>

      <!-- Premium Plan -->
      <div
        class="w-fit rounded-2xl border-4 border-blue-400 bg-black p-6 text-white hover:shadow-xl"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Premium plan</h3>
          <span
            class="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white"
            >Best Value</span
          >
        </div>
        <p class="mt-2 text-4xl font-extrabold">$15</p>
        <p class="text-gray-300">per user per month</p>
        <p class="mt-2 text-gray-300">Advanced features for power users.</p>
        <button
          class="mt-4 w-full rounded-lg bg-blue-500 p-2 font-bold text-white"
        >
          Get started
        </button>
        <ul class="mt-4 space-y-2 text-gray-300">
          <li>✅ Everything in Free Plan</li>
          <li>✅ Up to 500 AI-generated responses per month</li>
          <li>✅ Personalized AI suggestions</li>
          <li>✅ Priority email & chat support</li>
          <li>✅ AI-powered analytics & insights</li>
          <li>✅ API access for seamless integration</li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-4 p-6">
      <NuxtLink to="/other/support"
        ><button
          class="mt-4 w-[200px] rounded-lg border bg-white p-2 font-bold text-black"
        >
          Chat to sales
        </button></NuxtLink
      >
    </div>
  </div>
</template>
