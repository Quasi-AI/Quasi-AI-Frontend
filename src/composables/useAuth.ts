import { useAuthenticationStore } from '@/store/auth'

export const useAuth = () => {
  const authStore = useAuthenticationStore()
  const token = computed(() => sessionStorage.getItem('authToken'))

  const isLoggedIn = computed(() => !!token.value)

  onMounted(() => {
    authStore.loadToken()
  })

  return { isLoggedIn }
}
