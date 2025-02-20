<template>
  <div class="container mx-auto my-10 w-full lg:w-full xl:w-[80%] 2xl:w-[65%]">
    <template v-if="isLoggedIn">
      <div
        class="item-center mx-8 flex flex-col justify-between gap-6 rounded-2xl bg-white p-4 lg:flex-row dark:bg-[#111C44]"
      >
        <UserMe />

        <UTabs :items="tabItems" class="my-5 rounded-2xl p-4">
          <template #name>
            <UserName />
          </template>
          <template #email>
            <UserEmail />
          </template>
          <template #password>
            <UserPassword />
          </template>
        </UTabs>
      </div>
    </template>

    <template v-else>
      <p class="my-10 text-center text-2xl">You are not logged in</p>
      <UButton
        @click="goToLogin"
        color="blue"
        class="mx-auto my-10 flex w-[200px] items-center justify-center"
      >
        Login
      </UButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn } = useAuth()
const router = useRouter()

const tabItems = computed(() => [
  { slot: 'name', label: 'Name' },
  { slot: 'email', label: 'Email' },
  { slot: 'password', label: 'Password' }
])

const goToLogin = () => {
  router.push('/auth/login')
}
</script>
