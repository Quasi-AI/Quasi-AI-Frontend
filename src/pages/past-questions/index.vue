<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsQuestions />
    </template>
  </NuxtLayout>
</template>
