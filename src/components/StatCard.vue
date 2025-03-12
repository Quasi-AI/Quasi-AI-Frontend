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
})
</script>

<style scoped>
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 120px;
  transition: all 0.3s ease-in-out;

  /* 🌙 Dark mode support */
  @apply dark:border dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg;
}

/* Hover Effect */
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  @apply dark:shadow-xl;
}

/* Flex adjustments */
.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;

  /* Dark mode text */
  @apply dark:text-gray-400;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Dark mode text */
  @apply dark:text-white;
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

  /* Dark mode text */
  @apply dark:text-gray-400;
}

/* Icon container */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background-color: #eef2ff;
  border-radius: 12px;

  /* Dark mode background */
  @apply dark:bg-gray-700;
}

/* Icon */
.icon {
  width: 24px;
  height: 24px;

  /* Dark mode SVG color */
  @apply dark:text-white;
}

/* 🌍 Responsive Adjustments */
@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    margin-top: 8px;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    min-height: auto;
    padding: 0.75rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .trend {
    font-size: 0.7rem;
  }
}
</style>
