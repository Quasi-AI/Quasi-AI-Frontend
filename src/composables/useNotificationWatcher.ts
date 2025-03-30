import { useAuthenticationStore } from '@/store/auth'
import { TYPE, useToast } from 'vue-toastification'

export function useNotificationWatcher() {
  const AuthStore = useAuthenticationStore()
  const toast = useToast()

  const watchNotifications = (store: any) => {
    watch(
      () => store.success || store.error,
      newToastNotification => {
        if (newToastNotification) {
          toast(newToastNotification, {
            type: store.error ? TYPE.ERROR : TYPE.SUCCESS
          })
          store.clearSuccessAfterDelay() // Ensure this exists in your store
        }
      }
    )
  }

  watchNotifications(AuthStore)
}
