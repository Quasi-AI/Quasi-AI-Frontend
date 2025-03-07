<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonNavbar />
      <User />
    </template>
  </NuxtLayout>
</template>
