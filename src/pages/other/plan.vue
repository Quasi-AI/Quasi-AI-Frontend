<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonNavbar />
      <AppsOtherPlan />
    </template>
  </NuxtLayout>
</template>
