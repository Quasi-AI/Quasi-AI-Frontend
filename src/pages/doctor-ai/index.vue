<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsAiTutor />
    </template>
  </NuxtLayout>
</template>
