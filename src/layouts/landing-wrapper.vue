<template>
  <div
    :class="bgClass"
    class="mx-auto text-black transition-colors duration-300 dark:text-white"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const bgClass = ref('bg-[#E4E0F4] dark:bg-[#1E2A5A]')
const colorMode = useColorMode()

// Get current color mode instead of forcing light mode
const isDark = computed(() => colorMode.value === 'dark')

const handleScroll = () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    bgClass.value = 'bg-white dark:bg-[#111C44]'
  } else {
    bgClass.value = 'bg-[#E4E0F4] dark:bg-[#1E2A5A]'
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.3s ease-in-out;
}
</style>
