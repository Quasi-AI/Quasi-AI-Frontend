<template>
  <ClientOnly>
    <div class="flex min-h-screen w-full bg-[#F4F7FE] dark:bg-[#0C1438]">
      <!-- Sidebar -->
      <div
        class="w-0 bg-gray-200 transition-all duration-300 md:block md:w-[35%] lg:block lg:w-[20%] dark:bg-gray-900"
      >
        <slot name="sidebar"></slot>
      </div>

      <!-- Main Content -->
      <div class="flex h-screen flex-1 flex-col">
        <div class="overflow-auto">
          <slot name="apps"></slot>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
