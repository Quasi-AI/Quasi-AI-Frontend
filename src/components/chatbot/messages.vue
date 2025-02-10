<template>
  <div
    v-if="!props.chat.hideInChat"
    :class="[
      'my-2 flex w-fit items-start space-x-3 rounded-lg border px-2 py-1',
      props.chat.role === 'model'
        ? colorMode.value === 'dark'
          ? 'border-[#13171C] bg-gray-800 text-white'
          : 'bg-blue-50'
        : colorMode.value === 'dark'
          ? 'border-[#13171C] bg-gray-700 text-white'
          : 'bg-white',
      props.chat.isError ? 'border-[#13171C] bg-red-500 text-white' : '',
      props.chat.role === 'model' ? 'mr-auto' : 'ml-auto'
    ]"
  >
    <div class="flex flex-col">
      <p
        class="break-words text-sm leading-snug"
        v-html="`${props.chat.text}`"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['chat'])
const colorMode = useColorMode()
</script>
