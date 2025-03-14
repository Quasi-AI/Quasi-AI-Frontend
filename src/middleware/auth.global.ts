import axios from 'axios'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const token = localStorage.getItem('authToken')
  if (!token) {
    if (to.path !== '/') {
      await logSecurityAction('Unauthorized access attempt', 'Failed')
      await logSystemAction('Unauthorized access attempt', 'ERROR', to.path)
    }
    return
  }

  try {
    const tokenParts = token.split('.')

    if (tokenParts.length !== 3) throw new Error('Invalid Token Format')

    const tokenPayload = JSON.parse(atob(tokenParts[1]))
    const tokenExpiry = tokenPayload.exp * 1000
    const currentTime = Date.now()

    if (currentTime >= tokenExpiry) {
      console.warn('Token expired. Logging out...')
      await logSecurityAction('Token expired', 'Failed')
      await logSystemAction('Token expired', 'ERROR', to.path)
      await logoutUser()
    }

    await logSecurityAction('Token authentication successful', 'Success')
  } catch (error) {
    console.error('Invalid token. Logging out...', error)
    await logSecurityAction('Invalid token detected', 'Failed')
    await logSystemAction('Invalid token detected', 'ERROR', to.path)
    await logoutUser()
    return navigateTo('/')
  }
})

const logoutUser = async () => {
  await logSecurityAction('User logged out', 'Success')
  await logSystemAction('User logged out', 'INFO', '/logout')
  localStorage.removeItem('authToken')
  localStorage.removeItem('name')
  localStorage.removeItem('email')
  localStorage.removeItem('role')
}

const logSecurityAction = async (action: string, status: string) => {
  try {
    const userEmail = localStorage.getItem('email') || 'Unknown'
    const userAgent = navigator.userAgent
    const ipAddress = await getUserIP()

    await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/log-action',
      {
        user: userEmail,
        action,
        status,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString()
      }
    )
  } catch (error) {
    console.error('Failed to log security action:', error)
  }
}

const logSystemAction = async (
  message: string,
  level: string,
  endpoint: string
) => {
  try {
    await axios.post(
      'https://dark-caldron-448714-u5.uc.r.appspot.com/system-logs',
      {
        method: 'AUTH',
        endpoint,
        status: level,
        message
      }
    )
  } catch (error) {
    console.error('Failed to log system action:', error)
  }
}

const getUserIP = async () => {
  try {
    const response = await axios.get('https://api64.ipify.org?format=json')
    return response.data.ip
  } catch (error) {
    console.error('Failed to fetch IP address:', error)
    return 'Unknown'
  }
}
