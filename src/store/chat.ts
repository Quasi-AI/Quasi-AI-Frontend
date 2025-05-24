import axios from 'axios'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as { key: string; title: string }[],
    messages: [] as { text: string; sender: 'me' | 'other' }[],
    activeChatId: null as string | null
  }),
  actions: {
    setActiveChat(id: string) {
      this.activeChatId = id
      this.messages = []
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

        if (
          Array.isArray(response.data.conversation) &&
          response.data.conversation.length > 0
        ) {
          this.messages = response.data.conversation.flatMap(
            (item: { message: string; response: string }) => [
              { text: item.message, sender: 'me' },
              { text: item.response, sender: 'other' }
            ]
          )
        } else {
          this.messages = []
        }
        return response.data
      } catch (error) {
        console.error('Failed to fetch chats:', error)
        this.messages = []
      }
    },
    async fetchChatHistory(userId: string) {
      try {
        const response = await axios.get(
          `https://dark-caldron-448714-u5.uc.r.appspot.com/smart/chat-history/${userId}`
        )

        const data = response.data
        const incomingChats = response.data.Chat_History || []
        // Filter out chats that already exist by key
        const existingKeys = new Set(this.chats.map(chat => chat.key))
        const newChats = incomingChats.filter(
          (chat: { key: string }) => !existingKeys.has(chat.key)
        )
        this.chats = this.chats.concat(newChats)
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
        // Add user message to the chat
        this.messages.push({ text: message, sender: 'me' })

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
          throw new Error(data?.error?.message ?? 'Something went wrong!')

        if (Array.isArray(data.conversation)) {
          // Transform the conversation array into messages
          this.messages = data.conversation.flatMap(
            (item: { message: string; response: string }) => [
              { text: item.message, sender: 'me' },
              { text: item.response, sender: 'other' }
            ]
          )
        }
      } catch (error) {
        console.error('Failed to send chat:', error)
        this.messages.push({
          text: 'Failed to send message. Please try again.',
          sender: 'other'
        })
      }
    },
    clearMessages() {
      this.messages = []
    },
    deleteChat(chatId: string) {
      // Find the index of the chat to be deleted
      const index = this.chats.findIndex(chat => chat.key === chatId)

      if (index !== -1) {
        // Remove the chat
        this.chats.splice(index, 1)

        // If the deleted chat was the active one, handle that case
        if (this.activeChatId === chatId) {
          if (this.chats.length > 0) {
            // Set the first available chat as active
            this.setActiveChat(this.chats[0].key)
          } else {
            // Reset active chat if no chats left
            this.activeChatId = null
            this.messages = []
          }
        }
      }
    }
  }
})
