<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsSmartTutoring :inputPlaceholder="'Ask smart tutoring...'" />
    </template>
  </NuxtLayout>
</template>
