<template>
  <ClientOnly>
    <div class="w-full bg-[#F4F7FE] dark:bg-[#0C1438]">
      <div class="flex items-start">
        <div class="hidden w-[30%] lg:block lg:w-[20%]">
          <slot name="sidebar"></slot>
        </div>
        <div class="flex w-full flex-col lg:flex-row">
          <div class="min-w-[100%]">
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
