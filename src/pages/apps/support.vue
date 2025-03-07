<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonNavbar />
      <AppsOtherSupport />
    </template>
  </NuxtLayout>
</template>
