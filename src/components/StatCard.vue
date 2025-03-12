<template>
  <div class="stat-card">
    <div class="stat-info">
      <p class="stat-label">{{ title }}</p>
      <h3 class="stat-value">{{ value }}</h3>
      <div class="trend">
        <span :class="trendColor">{{ trend }}</span>
        <span class="trend-text">Up from last month</span>
      </div>
    </div>
    <div class="icon-container">
      <component :is="svg" class="icon" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  trend: String,
  trendColor: String,
  svg: Object // SVG component passed as a prop
});
</script>

<style scoped>
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1.25rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 280px;
  min-height: 100px;
  transition: all 0.3s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: bold;
  color: #111827;
}

.trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.trend-text {
  color: #6b7280;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  background-color: #eef2ff;
  border-radius: 12px;
}

.icon {
  width: 28px;
  height: 28px;
}
</style>
