<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <Sidebar />
    </template>
    <template #apps>
      <Navbar />
      <AppsAiTutor />
    </template>
  </NuxtLayout>
</template>
