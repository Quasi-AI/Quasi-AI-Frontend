import { useAuthenticationStore } from '@/store/auth'
import { TYPE, useToast } from 'vue-toastification'

export function useNotificationWatcher() {
  const AuthStore = useAuthenticationStore()
  const toast = useToast()

  const watchNotifications = (
    store: any,
    _p0?: { success: string; error: string }
  ) => {
    watch(
      () => store.success || store.error,
      newToastNotification => {
        if (newToastNotification) {
          toast(newToastNotification, {
            type: store.error ? ('error' as TYPE) : ('success' as TYPE)
          })
          store.clearSuccessAfterDelay()
        }
      }
    )
  }

  watchNotifications(AuthStore, { success: 'blue', error: 'red' })
}
