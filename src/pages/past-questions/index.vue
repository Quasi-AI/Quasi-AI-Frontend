<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <Sidebar />
    </template>
    <template #apps>
      <Navbar />
      <AppsQuestions />
    </template>
  </NuxtLayout>
</template>
