<template>
  <div>
    <img
      v-if="imgSrc && imgSrc !== 'null'"
      :class="[baseClass, scale ? 'hover:scale-105' : '', rounded]"
      data-cy="roundedFull"
      :src="imgSrc"
      :alt="name"
    />

    <div
      v-else
      :class="[
        baseClass,
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow-sm dark:bg-[#0C1438]',
        scale ? 'hover:scale-105' : ''
      ]"
    >
      <span
        class="text-primary-text-color dark:text-primary-text-color uppercase"
        :class="textSize"
      >
        {{ usernameToInitials(name) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usernameToInitials } from '@/utils/usernameToInitials'

defineProps({
  imgSrc: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'Profile Image'
  },
  baseClass: {
    type: String,
    default: 'w-12 h-12'
  },
  textSize: {
    type: String,
    default: 'text-xl'
  },
  rounded: {
    type: String,
    default: 'rounded-full'
  },
  scale: {
    type: Boolean,
    default: false
  }
})
</script>
