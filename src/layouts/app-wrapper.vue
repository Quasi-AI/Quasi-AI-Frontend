<template>
  <ClientOnly>
    <div class="flex w-full bg-[#F4F7FE] dark:bg-[#0C1438]">
      <!-- Sidebar (Hidden on Mobile) -->
      <div
        class="hidden min-h-screen w-64 bg-gray-200 transition-all duration-300 md:block dark:bg-gray-900"
      >
        <slot name="sidebar"></slot>
      </div>

      <!-- Main Content (Pushes Right on Larger Screens) -->
      <div class="flex-1">
        <div class="overflow-auto py-10">
          <slot name="apps"></slot>
          <LayoutNavbarBottom />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
