import { ref } from 'vue'
import axios from 'axios'

export function useDashboardData() {
  const cards = ref([{}, {}, {}, {}])
  const recentFlashcards = ref([])
  const students = ref([])
  const studentCount = ref(0)
  const educatorCount = ref(0)
  const chartSeries = ref([])
  const quizChartSeries = ref([])
  const isLoading = ref(true)
  const userInfo = ref({
    name: '',
    email: ''
  })

  // Initialize user info from session storage
  const initUserInfo = () => {
    const storedName = sessionStorage.getItem('name') || 'Default Name'
    const storedEmail = sessionStorage.getItem('email') || 'default@example.com'
    userInfo.value = { name: storedName, email: storedEmail }
  }

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const response = await axios.post(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/dashboard',
        {
          role: sessionStorage.getItem('role'),
          user_id: sessionStorage.getItem('user_id')
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      cards.value = response.data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch flashcards
  const fetchFlashCards = async () => {
    try {
      const userId = sessionStorage.getItem('user_id')
      const response = await fetch(
        `https://dark-caldron-448714-u5.uc.r.appspot.com/flashcards/${userId}`
      )

      if (!response.ok) throw new Error('Failed to fetch flashcards')

      const data = await response.json()
      recentFlashcards.value = data.flashcards
    } catch (error) {
      console.error('Failed to fetch flashcards data:', error)
    }
  }

  // Fetch students list
  const fetchStudents = async () => {
    try {
      const userId = sessionStorage.getItem('user_id')
      const response = await fetch(
        `https://dark-caldron-448714-u5.uc.r.appspot.com/educator-student/${userId}`
      )

      if (!response.ok) throw new Error('Failed to fetch students')

      const data = await response.json()
      students.value = data.users
    } catch (error) {
      console.error('Failed to fetch students data:', error)
    }
  }

  // Fetch total users data
  const fetchUsersData = async () => {
    try {
      const studentResponse = await axios.get(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/students/'
      )
      const educatorResponse = await axios.get(
        'https://dark-caldron-448714-u5.uc.r.appspot.com/educators/'
      )

      studentCount.value = studentResponse.data.totalStudents
      educatorCount.value = educatorResponse.data.totalEducators
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Fetch chart data for flashcards and quizzes
  const fetchChartData = async () => {
    try {
      const userId = sessionStorage.getItem('user_id')
      const response = await fetch(
        `https://dark-caldron-448714-u5.uc.r.appspot.com/flash-quiz/${userId}`
      )

      if (!response.ok) throw new Error('Failed to fetch chart data')

      const data = await response.json()
      chartSeries.value = data.data
      quizChartSeries.value = data.data
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    }
  }

  // Initialize all data
  const initializeData = async () => {
    initUserInfo()
    await Promise.all([
      fetchStats(),
      fetchFlashCards(),
      fetchUsersData(),
      fetchStudents(),
      fetchChartData()
    ])
  }

  return {
    cards,
    recentFlashcards,
    students,
    studentCount,
    educatorCount,
    chartSeries,
    quizChartSeries,
    isLoading,
    userInfo,
    initializeData
  }
}
