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
      this.messages = [] // Clear messages when switching chats
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

        if (Array.isArray(response.data.conversation) && response.data.conversation.length > 0) {
          this.messages = response.data.conversation.flatMap((item: { message: string; response: string }) => [
            { text: item.message, sender: 'me' },
            { text: item.response, sender: 'other' }
          ])
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
          throw new Error(data?.error?.message || 'Something went wrong!')

        if (Array.isArray(data.conversation)) {
          // Transform the conversation array into messages
          this.messages = data.conversation.flatMap((item: { message: string; response: string }) => [
            { text: item.message, sender: 'me' },
            { text: item.response, sender: 'other' }
          ])
        }
      } catch (error) {
        console.error('Failed to send chat:', error)
        this.messages.push({ 
          text: 'Failed to send message. Please try again.',
          sender: 'other'
        })
      }
    }
  }
})
