import { useAuthenticationStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthenticationStore()

  authStore.loadToken()

  const isAuthRoute = to.path.startsWith('/auth/')

  if (!authStore.token && to.path !== '/' && !isAuthRoute) {
    return navigateTo('/')
  }

  if (authStore.token && (to.path === '/' || isAuthRoute)) {
    return navigateTo('/dashboard')
  }
})
