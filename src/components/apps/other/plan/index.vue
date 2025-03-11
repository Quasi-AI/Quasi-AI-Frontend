<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 dark:bg-[#1E2A5A]"
  >
    <h1 class="text-4xl font-bold text-slate-800 dark:text-gray-300">
      We've got a plan <br />
      that's perfect for you
    </h1>
    <div class="grid w-full max-w-5xl gap-6 sm:grid-cols-1 md:grid-cols-3">
      <!-- Basic Plan -->
      <div
        class="rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
      >
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Basic plan
        </h3>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
          $10
        </p>
        <p class="text-gray-600 dark:text-gray-300">per user per month</p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Basic features for up to 10 users.
        </p>
        <button
          class="mt-4 w-full rounded-lg bg-black p-2 font-bold text-white"
        >
          Get started
        </button>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li>✅ Access to Quasi AI basic features</li>
          <li>✅ Up to 50 AI-generated responses per month</li>
          <li>✅ Personalized AI suggestions</li>
          <li>✅ Email support</li>
          <li>✅ Secure cloud storage for AI-generated content</li>
          <li>❌ Custom AI training for your needs</li>
          <li>❌ API access for seamless integration</li>
        </ul>
      </div>

      <!-- Business Plan -->
      <div
        class="rounded-2xl border-4 border-blue-400 bg-black p-6 text-white hover:shadow-xl"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Business plan</h3>
          <span
            class="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white"
            >Popular</span
          >
        </div>
        <p class="mt-2 text-4xl font-extrabold">$20</p>
        <p class="text-gray-300">per user per month</p>
        <p class="mt-2 text-gray-300">Growing teams up to 20 users.</p>
        <button
          class="mt-4 w-full rounded-lg bg-blue-500 p-2 font-bold text-white"
        >
          Get started
        </button>
        <ul class="mt-4 space-y-2 text-gray-300">
          <li>✅ Everything in Personal Plan</li>
          <li>✅ Up to 500 AI-generated responses per month</li>
          <li>✅ Priority email & chat support</li>
          <li>✅ Team collaboration tools</li>
          <li>✅ AI-powered analytics & insights</li>
          <li>✅ API access for seamless integration</li>
          <li>❌ On-premise or private cloud deployment</li>
          <li>❌ Custom API integrations & workflow automation</li>
        </ul>
      </div>

      <!-- Enterprise Plan -->
      <div
        class="rounded-2xl border bg-white p-6 hover:shadow-xl dark:border-[#0C1438] dark:bg-[#1E2A5A] dark:text-white"
      >
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Enterprise plan
        </h3>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
          $40
        </p>
        <p class="text-gray-600 dark:text-gray-300">per user per month</p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Advanced features + unlimited users.
        </p>

        <button
          class="mt-4 w-full rounded-lg bg-black p-2 font-bold text-white"
        >
          Get started
        </button>
        <ul class="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li>✅ Everything in Business Plan</li>
          <li>✅ Unlimited AI-generated responses</li>
          <li>✅ Dedicated account manager</li>
          <li>✅ 24/7 premium support</li>
          <li>✅ Custom AI solutions & fine-tuning</li>
          <li>✅ Advanced security & compliance features</li>
          <li>✅ Exclusive access to new AI features</li>
          <li>✅ On-premise or private cloud deployment</li>
          <li>✅ Custom API integrations & workflow automation</li>
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
