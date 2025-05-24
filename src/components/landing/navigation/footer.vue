<template>
  <div class="bg-[#252641] px-6 py-12 text-white">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 lg:flex-row-reverse"
    >
      <!-- Newsletter Section -->
      <div class="w-full max-w-md text-center lg:text-left">
        <p class="mb-4 text-sm font-medium text-gray-300">
          Subscribe to get our Newsletter
        </p>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="email"
            placeholder="Your Email"
            class="h-10 w-full rounded-full border border-gray-500 bg-transparent px-4 text-sm text-white placeholder-gray-400 transition focus:border-[#5D3BEA] focus:outline-none focus:ring-1 focus:ring-[#5D3BEA] sm:max-w-[250px]"
          />
          <button
            class="w-full rounded-lg bg-[#5D3BEA] px-6 py-2 text-sm font-medium text-white transition duration-300 hover:bg-[#4A2DCA] sm:w-auto"
          >
            Subscribe
          </button>
        </div>
      </div>

      <!-- Links Section -->
      <div
        class="flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-end"
      >
        <NuxtLink
          to="/careers"
          class="text-gray-300 transition hover:text-white"
        >
          Careers
        </NuxtLink>
        <div class="h-4 border-l border-gray-500"></div>
        <NuxtLink
          to="/privacy-policy"
          class="text-gray-300 transition hover:text-white"
        >
          Privacy Policy
        </NuxtLink>
        <div class="h-4 border-l border-gray-500"></div>
        <NuxtLink
          to="/terms-conditions"
          class="text-gray-300 transition hover:text-white"
        >
          Terms & Conditions
        </NuxtLink>
      </div>

      <!-- Copyright -->
      <p class="mt-8 text-center text-xs text-gray-400 lg:mt-0">
        © {{ new Date().getFullYear() }} QUASI AI. All rights reserved.
      </p>
    </div>
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
