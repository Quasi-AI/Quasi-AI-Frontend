<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonNavbar />
      <Apps />
    </template>
  </NuxtLayout>
</template>
