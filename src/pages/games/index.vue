<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #apps>
      <LayoutNavbar />
      <AppsGames />
    </template>
  </NuxtLayout>
</template>
