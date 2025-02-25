<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Subscription Plans -->
    <div class="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-3">
      <!-- Personal Plan -->
      <div class="rounded-2xl bg-white p-6 shadow hover:shadow-xl dark:bg-[#111C44] dark:text-white">
        <h3 class="text-xl font-bold">Personal</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">For individuals.</p>
        <ul class="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
          <li>✅ Access to Quasi AI basic features</li>
          <li>✅ Up to 50 AI-generated responses per month</li>
          <li>✅ Personalized AI suggestions</li>
          <li>✅ Email support</li>
          <li>✅ Secure cloud storage for AI-generated content</li>
          <li>❌ Custom AI training for your business needs</li>
          <li>❌ API access for seamless integration</li>
          <li>❌ On-premise or private cloud deployment</li>
          <li>❌ Custom API integrations & workflow automation</li>
        </ul>
        <p class="mt-2 text-2xl font-bold">$5 / month</p>
        <button class="mt-4 w-full rounded-lg bg-gray-400 p-2 text-white cursor-not-allowed" disabled>
          Subscribe
        </button>
      </div>

      <!-- Business Plan -->
      <div class="rounded-2xl bg-white p-6 shadow hover:shadow-xl dark:bg-[#111C44] dark:text-white">
        <h3 class="text-xl font-bold">Business</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">For small teams.</p>
        <ul class="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
          <li>✅ Everything in Personal Plan</li>
          <li>✅ Up to 500 AI-generated responses per month</li>
          <li>✅ Priority email & chat support</li>
          <li>✅ Team collaboration tools</li>
          <li>✅ AI-powered analytics & insights</li>
          <li>✅ Custom AI training for your business needs</li>
          <li>✅ API access for seamless integration</li>
          <li>❌ On-premise or private cloud deployment</li>
          <li>❌ Custom API integrations & workflow automation</li>
        </ul>
        <p class="mt-2 text-2xl font-bold">$15 / month</p>
        <button class="mt-4 w-full rounded-lg bg-gray-400 p-2 text-white cursor-not-allowed" disabled>
          Subscribe
        </button>
      </div>

      <!-- Enterprise Plan -->
      <div class="rounded-2xl bg-white p-6 shadow hover:shadow-xl dark:bg-[#111C44] dark:text-white">
        <h3 class="text-xl font-bold">Enterprise</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">For large organizations.</p>
        <ul class="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
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
        <p class="mt-2 text-2xl font-bold">$25 / month</p>
        <button class="mt-4 w-full rounded-lg bg-gray-400 p-2 text-white cursor-not-allowed" disabled>
          Subscribe
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  background-color: gray;
  cursor: not-allowed;
}
</style>
