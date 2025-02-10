<template>
  <ClientOnly>
    <div
      class="w-full"
      :class="colorMode.value === 'dark' ? 'bg-[#0C1438]' : 'bg-[#F4F7FE]'"
    >
      <div class="flex items-start">
        <div class="hidden w-[30%] lg:block lg:w-[20%]">
          <slot name="sidebar"></slot>
        </div>
        <div class="flex w-full flex-col lg:flex-row">
          <div
            class="min-w-[100%]"
            :class="colorMode.value === 'dark' ? 'border-[#3b3b3b]' : ''"
          >
            <slot name="apps"></slot>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
