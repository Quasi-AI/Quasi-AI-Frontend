<template>
  <ClientOnly>
    <div class="flex w-full bg-[#F4F7FE] dark:bg-[#0C1438]">
      <!-- Sidebar -->
      <div
        class="w-0 bg-gray-200 transition-all duration-300 md:block dark:bg-gray-900"
      >
        <slot name="sidebar"></slot>
      </div>

      <!-- Main Content -->
      <div class="flex h-screen flex-1 flex-col">
        <div class="overflow-auto py-10">
          <slot name="apps"></slot>
          <LayoutNavbarFooter />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
