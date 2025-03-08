<template>
  <NuxtLayout name="dashboard-wrapper">
    <template #sidebar>
      <CommonSidebar />
    </template>
    <template #apps>
      <CommonDashboardMockDashboard width="100%" height="100%" />
    </template>
  </NuxtLayout>
</template>
