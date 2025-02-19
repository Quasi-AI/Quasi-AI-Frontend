export const generateBotResponse = async (history, chatHistoryRef) => {
  const updateHistory = (text, isError = false) => {
    chatHistoryRef.value = chatHistoryRef.value.filter(
      msg => msg.text !== 'Thinking...'
    )
    chatHistoryRef.value.push({ role: 'model', text, isError })
  }

  history = history.map(({ role, text }) => ({ role, parts: [{ text }] }))
  try {
    const response = await fetch(
      useRuntimeConfig().public.GOOGLE_GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: history })
      }
    )
    const data = await response.json()
    if (!response.ok)
      throw new Error(data?.error?.message || 'Something went wrong!')
    const botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!botMessage) throw new Error('Invalid response from the server')
    updateHistory(botMessage.replace(/\*\*(.*?)\*\*/g, '$1').trim())
  } catch (error) {
    updateHistory(error.message, true)
  }
}
