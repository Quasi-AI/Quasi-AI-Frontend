import axios from 'axios'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const token = sessionStorage.getItem('authToken')

  // Allow access to only '/' and any route under '/auth' if no token
  if (!token) {
    if (!to.path.startsWith('/auth') && to.path !== '/') {
      await logSecurityAction('Unauthorized access attempt', 'Failed')
      await logSystemAction('Unauthorized access attempt', 'ERROR', to.path)
      return navigateTo('/')
    }
    return
  }

  try {
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) throw new Error('Invalid Token Format')

    const tokenPayload = JSON.parse(atob(tokenParts[1]))
    const tokenExpiry = tokenPayload.exp * 1000
    const currentTime = Date.now()

    // If token expired, log out the user and redirect to login
    if (currentTime >= tokenExpiry) {
      console.warn('Token expired. Logging out...')
      await logoutUser()
      return navigateTo('/')
    }

    await logSecurityAction('Token authentication successful', 'Success')
  } catch (error) {
    console.error('Invalid token. Logging out...', error)
    await logoutUser()
    return navigateTo('/')
  }
})

// Logout function that clears session and redirects
const logoutUser = async () => {
  await logSecurityAction('User logged out', 'Success')
  await logSystemAction('User logged out', 'INFO', '/logout')

  sessionStorage.clear() // Clear all session data
  navigateTo('/') // Force redirect after logout
}

const logSecurityAction = async (action, status) => {
  try {
    const userEmail = sessionStorage.getItem('email') || 'Unknown'
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

const logSystemAction = async (message, level, endpoint) => {
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
