import { useAuthenticationStore } from '@/store/auth'

export const useAuth = () => {
  const authStore = useAuthenticationStore()
  const token = computed(() => localStorage.getItem('token'))
  const email = computed(() => localStorage.getItem('email'))
  const role = computed(() => localStorage.getItem('role'))

  const isLoggedIn = computed(
    () => !!token.value && !!email.value && !!role.value
  )

  onMounted(() => {
    authStore.loadToken()
  })

  return { isLoggedIn, email, role }
}
