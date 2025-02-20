export const generateBotResponse = async (user_id, message, chatHistoryRef) => {
  const updateHistory = (text, isError = false) => {
    chatHistoryRef.value = chatHistoryRef.value.filter(
      msg => msg.text !== 'Thinking...'
    )
    chatHistoryRef.value.push({ role: 'model', text, isError })
  }

  const apiUrl =
    'https://dark-caldron-448714-u5.uc.r.appspot.com/smart/generate'

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, message })
    })

    const data = await response.json()
    if (!response.ok)
      throw new Error(data?.error?.message || 'Something went wrong!')

    const botMessage = data?.response || 'No response received.'
    updateHistory(botMessage)
  } catch (error) {
    console.error('Error fetching bot response:', error)
    updateHistory(error.message, true)
  }
}
