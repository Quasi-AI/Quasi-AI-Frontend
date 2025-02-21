<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsDoctorAi :inputPlaceholder="'Ask doctor ai...'" />
    </template>
  </NuxtLayout>
</template>
