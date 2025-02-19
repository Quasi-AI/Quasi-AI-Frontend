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
        'inline-flex items-center justify-center overflow-hidden border border-slate-300 shadow-sm',
        scale ? 'hover:scale-105' : ''
      ]"
    >
      <span
        class="text-primary-text-color dark:text-primary-text-color font-medium uppercase"
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
    default: 'w-12 h-12' // Default size (3rem)
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
