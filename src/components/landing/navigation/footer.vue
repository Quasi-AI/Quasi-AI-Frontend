<template>
  <div
    class="flex flex-col items-center justify-center gap-6 bg-[#252641] px-6 py-8 text-center text-white lg:px-12 lg:py-6 xl:mx-auto 2xl:w-[1440px]"
  >
    <!-- Newsletter Subscription Section -->
    <div class="mb-6 lg:mb-0">
      <p class="mb-4 text-sm text-gray-300">Subscribe to get our Newsletter</p>
      <div class="flex items-center justify-center gap-2">
        <input
          type="email"
          placeholder="Your Email"
          class="Lg:max-w-[250px] h-10 max-w-[200px] rounded-full border border-gray-500 bg-[#252641] px-4 text-sm text-gray-400 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#5D3BEA] lg:w-[300px]"
        />
        <button
          class="h-10 w-24 rounded-full bg-[#5D3BEA] text-sm font-medium text-white transition hover:bg-[#4A2DCA]"
        >
          Subscribe
        </button>
      </div>
    </div>

    <!-- Links Section -->
    <div
      class="mb-6 flex-wrap items-center gap-4 lg:mb-0 lg:items-center lg:gap-6"
    >
      <NuxtLink
        to="/"
        class="text-sm text-gray-300 transition hover:text-white"
      >
        Careers
      </NuxtLink>
      <NuxtLink
        to="/"
        class="pl-2 text-sm text-gray-300 transition hover:text-white lg:border-l-2 lg:border-gray-500"
      >
        Privacy Policy
      </NuxtLink>
      <NuxtLink
        to="/"
        class="pl-2 text-sm text-gray-300 transition hover:text-white lg:border-l-2 lg:border-gray-500"
      >
        Terms & Conditions
      </NuxtLink>
      <NuxtLink
        to="/"
        class="pl-2 text-sm text-gray-300 transition hover:text-white lg:border-l-2 lg:border-gray-500"
      >
        Contact Us
      </NuxtLink>
      <NuxtLink
        to="/"
        class="pl-2 text-sm text-gray-300 transition hover:text-white lg:border-l-2 lg:border-gray-500"
      >
        FAQ
      </NuxtLink>
    </div>

    <!-- Copyright Section -->
    <p class="text-xs text-gray-400">© 2025 QUASI AI. All rights reserved.</p>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
