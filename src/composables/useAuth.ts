import { useAuthenticationStore } from '@/store/auth'

export const useAuth = () => {
  const authStore = useAuthenticationStore()
  const token = computed(() => sessionStorage.getItem('token'))
  const email = computed(() => sessionStorage.getItem('email'))
  const role = computed(() => sessionStorage.getItem('role'))

  const isLoggedIn = computed(
    () => !!token.value && !!email.value && !!role.value
  )

  onMounted(() => {
    authStore.loadToken()
  })

  return { isLoggedIn, email, role }
}
