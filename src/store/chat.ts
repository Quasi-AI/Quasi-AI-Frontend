import axios from 'axios'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as { key: string; title: string }[],
    messages: [] as { text: string; message: 'me' | 'other' }[],
    activeChatId: null as string | null
  }),
  actions: {
    setActiveChat(id: string) {
      this.activeChatId = id
      this.fetchChat(id)
    },
    async fetchChat(chatId: string) {
      try {
        const response = await axios.get(
          `https://dark-caldron-448714-u5.uc.r.appspot.com/smart/chat/${chatId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const data = response.data
        this.messages.push(response.data.conversation)
        return data
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      }
    },
    async fetchChatHistory(userId: string) {
      try {
        const response = await axios.get(
          `https://dark-caldron-448714-u5.uc.r.appspot.com/smart/chat-history/${userId}`
        )

        const data = response.data
        this.chats = this.chats.concat(response.data.Chat_History)
        return data
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      }
    },
    async sendChat(
      chatId: string,
      title: string,
      userId: string,
      message: string
    ) {
      try {
        const response = await fetch(
          'https://dark-caldron-448714-u5.uc.r.appspot.com/smart/generate',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: chatId,
              title,
              user_id: userId,
              message
            })
          }
        )

        const data = await response.json()
        if (!response.ok)
          throw new Error(data?.error?.message || 'Something went wrong!')

        this.messages = data?.conversation || 'No response received.'
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      }
    }
  }
})
