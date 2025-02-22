import { useAuthenticationStore } from '@/store/auth'

export const useUser = () => {
  const authStore = useAuthenticationStore()
  const userInfo = ref<{
    id: number | null
    name: string
    email: string
    profileImage: string
  } | null>(null)

  onMounted(async () => {
    authStore.loadToken()
    if (authStore.token) {
      await authStore.fetchUserDetails()
      userInfo.value = authStore.getUserInfo()
    }
  })

  return { userInfo }
}
