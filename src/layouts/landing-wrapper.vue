<template>
  <div
    :class="bgClass"
    class="mx-auto text-black transition-colors duration-300"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const bgClass = ref('bg-[#E4E0F4]')
const colorMode = useColorMode()

// force colormode to light
colorMode.preference = 'light'

const handleScroll = () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    bgClass.value = 'bg-white'
  } else {
    bgClass.value = 'bg-[#E4E0F4]'
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
