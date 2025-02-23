<template>
    <div class="flex flex-col gap-8 p-6 lg:flex-row">
      <!-- Feedback Form -->
      <div class="flex w-full flex-col items-center gap-6 lg:w-1/2">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Send Feedback</h2>
  
        <input
          v-model="name"
          type="text"
          placeholder="Your Name"
          class="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow focus:border-[#5D3BEA] focus:ring-2 focus:ring-[#5D3BEA] dark:bg-gray-900 dark:text-white"
        />
  
        <input
          v-model="email"
          type="email"
          placeholder="Your Email"
          class="w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow focus:border-[#5D3BEA] focus:ring-2 focus:ring-[#5D3BEA] dark:bg-gray-900 dark:text-white"
        />
  
        <textarea
          v-model="message"
          placeholder="Your Message"
          class="min-h-[20vh] w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow focus:border-[#5D3BEA] focus:ring-2 focus:ring-[#5D3BEA] dark:bg-gray-900 dark:text-white"
        ></textarea>
  
        <button
          :disabled="loading"
          class="w-full rounded-lg bg-[#5D3BEA] p-3 text-white hover:bg-[#4C2DBE] transition disabled:bg-gray-400"
          @click="submitFeedback"
        >
          {{ loading ? "Submitting..." : "Submit Feedback" }}
        </button>
        
        <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
      </div>
      <!-- Live Chat Section -->
      <div class="flex w-full flex-col lg:w-1/2">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Live Chat</h2>
        
        <div class="h-[50vh] w-full overflow-y-auto rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
          <div v-for="(chat, index) in chats" :key="index" class="mb-2">
            <span class="font-bold text-[#5D3BEA]">{{ chat.user }}:</span>
            <span class="text-gray-800 dark:text-white">{{ chat.message }}</span>
          </div>
        </div>
  
        <div class="mt-4 flex gap-2">
          <input
            v-model="chatMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 rounded-lg border border-gray-300 p-3 text-gray-800 shadow focus:border-[#5D3BEA] focus:ring-2 focus:ring-[#5D3BEA] dark:bg-gray-900 dark:text-white"
          />
          <UButton class="rounded-lg bg-[#5D3BEA] p-3 text-white" @click="sendMessage">
            Send
          </UButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const name = ref("");
  const email = ref("");
  const message = ref("");
  const loading = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");
  const chatMessage = ref("")
  const chats = ref([])
  
  const submitFeedback = async () => {
    if (!name.value || !email.value || !message.value) {
      errorMessage.value = "Please fill in all fields!";
      return;
    }
  
    loading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
  
    try {
      const response = await axios.post(
        "https://dark-caldron-448714-u5.uc.r.appspot.com/create-feedback",
        {
          name: name.value,
          email: email.value,
          message: message.value,
        }
      );
  
      successMessage.value = "Feedback submitted successfully!";
      name.value = "";
      email.value = "";
      message.value = "";
    } catch (error) {
      errorMessage.value = "Error submitting feedback. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = () => {
    if (!chatMessage.value) return
    chats.value.push({ user: 'You', message: chatMessage.value })
    chatMessage.value = ''
  }
</script>
   