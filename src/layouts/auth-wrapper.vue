<template>
  <div
    class="w-full bg-[#F1F3FE] text-black transition-colors duration-300 dark:bg-[#1E2A5A] dark:text-white"
  >
    <div class="container mx-auto flex h-screen items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.transition-colors {
  transition: background-color 0.3s ease-in-out;
}
</style>
