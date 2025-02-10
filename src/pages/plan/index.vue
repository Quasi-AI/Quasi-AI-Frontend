<template>
  <NuxtLayout name="app-wrapper">
    <template #sidebar>
      <Sidebar />
    </template>
    <template #apps>
      <Navbar />
      <AppsPlan />
    </template>
  </NuxtLayout>
</template>
