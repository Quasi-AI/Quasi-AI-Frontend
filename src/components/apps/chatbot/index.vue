<template>
  <div class="flex h-screen flex-col items-center justify-between bg-gray-100 dark:bg-[#111C44]">
    <!-- Chat Messages -->
    <div ref="chatBodyRef" @scroll="handleScroll" class="flex-1 w-full max-w-2xl overflow-y-auto p-4 pb-20 relative">
      <div v-for="(chat, index) in chatHistory" :key="index" 
          :class="['p-3 rounded-lg w-fit max-w-[75%]', 
                    chat.role === 'user' ? 'ml-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white' : 'mr-auto text-black dark:text-white']">
        
        <!-- Render Markdown Content -->
        <div v-html="renderedMarkdown(chat.text || '')" class="markdown-content"></div>
      </div>
      
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="w-full flex justify-start items-center p-2">
        <span class="loading-spinner"></span>
      </div>
    </div>

    <!-- Input Box -->
    <div class="w-full max-w-2xl p-4 fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-[#111C44]">
      <button v-if="showScrollButton" @click="scrollToBottom"
        class="fixed bottom-40 right-5 bg-[#5d3be9] text-white p-2 rounded-full shadow-lg transition-opacity hover:bg-[#4a2fc5]">
        ↓
      </button>

      <form @submit.prevent="handleSubmit" class="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-lg dark:bg-[#1A2B5F]">
        <!-- Upload File Icon -->
        <button type="button" class="p-2" @click="handleFileUpload">
          <uploadIcon />
          <input type="file" ref="fileInput" class="hidden" @change="handleFileSelected" />
        </button>

        <!-- Record Icon -->
        <button type="button" class="p-2" @click="startRecording">
          <recordIcon />
        </button>

        <!-- Expanding Input Field -->
        <textarea v-model="inputRef" :placeholder="inputPlaceholder" 
                  @input="adjustTextareaHeight" ref="textarea"
                  class="w-full rounded-md bg-transparent outline-none dark:text-white px-2 resize-none overflow-hidden" 
                  rows="1" required></textarea>

        <!-- Send Button -->
        <button type="submit" class="p-2 text-black rounded-full bg-white transition dark:bg-[#1A2B5F]">
          <sendMsgIcon />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import sendMsgIcon from '@/assets/icons/send-msg.vue';
import uploadIcon from '@/assets/icons/upload.vue';
import recordIcon from '@/assets/icons/mic.vue';
import { generateBotResponse } from '@/utils/chatbot';
import type { ChatMessage } from '~/types/chatbot';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps({
  inputPlaceholder: { type: String, default: 'Type a message...' },
  initialMessage: { type: String, default: '' }
});

const chatHistory = ref<ChatMessage[]>([]);
const chatBodyRef = ref<HTMLElement | null>(null);
const inputRef = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const showScrollButton = ref(false);
const userId = localStorage.getItem('user_id');

onMounted(() => {
  const savedChatHistory = localStorage.getItem('chatHistory_componentName');
  chatHistory.value = savedChatHistory ? JSON.parse(savedChatHistory) : 
                      props.initialMessage ? [{ role: 'model', text: props.initialMessage }] : [];
  scrollToBottom();

  // Attach event listener for copy buttons
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('copy-btn')) {
      copyCodeToClipboard(target);
    }
  });
});



const renderedMarkdown = (text?: string) => {
  if (!text) return '';

  return marked.parse(text, {
    highlight: function (code, lang) {
      const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlightedCode = hljs.highlight(code, { language: validLang }).value;

      return `
        <div class="code-container relative">
          <button class="copy-btn absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded" data-id="copy">
            Copy
          </button>
          <pre><code class="hljs ${validLang}">${highlightedCode}</code></pre>
        </div>
      `;
    }
  });
};


const copyCodeToClipboard = (button: HTMLElement) => {
  const codeElement = button.nextElementSibling?.querySelector('code');
  if (!codeElement) return;

  const textToCopy = codeElement.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    button.innerText = "Copied!";
    setTimeout(() => (button.innerText = "Copy"), 2000);
  });
};



const saveChatHistory = () => {
  localStorage.setItem('chatHistory_componentName', JSON.stringify(chatHistory.value));
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTo({ top: chatBodyRef.value.scrollHeight, behavior: 'smooth' });
      showScrollButton.value = false;
    }
  });
};

const handleScroll = () => {
  if (chatBodyRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.value;
    showScrollButton.value = scrollTop + clientHeight < scrollHeight - 100;
  }
};

const setChatHistory = (fn: (history: ChatMessage[]) => ChatMessage[]) => {
  chatHistory.value = fn(chatHistory.value);
  saveChatHistory();
  scrollToBottom();
};

// Handle User Input Submission
const handleSubmit = () => {
  if (!inputRef.value.trim()) return;

  const userMessage = inputRef.value;
  inputRef.value = '';
  adjustTextareaHeight();

  if (userMessage.toLowerCase() === 'clear') {
    localStorage.removeItem('chatHistory_componentName');
    chatHistory.value = props.initialMessage ? [{ role: 'model', text: props.initialMessage }] : [];
    return;
  } else if (userMessage.toLowerCase() === 'logout') {
    window.location.reload();
    return;
  }

  setChatHistory(history => {
    const updatedHistory = [...history, { role: 'user', text: userMessage }];
    isLoading.value = true;

    setTimeout(() => {
      generateBotResponse(userId, userMessage, chatHistory).then(() => {
        isLoading.value = false;
      });
    }, 600);

    return updatedHistory;
  });
};

// Auto-expand textarea
const adjustTextareaHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

// Handle File Upload
const handleFileUpload = () => {
  fileInput.value?.click();
};

const handleFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    setChatHistory(history => [...history, { role: 'user', text: `Uploaded file: ${file.name}` }]);
  }
};

// Handle Voice Recording
const startRecording = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputRef.value += transcript;
    adjustTextareaHeight();
  };
};
</script>

<style scoped>
/* Loading Indicator */
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(93, 59, 233, 0.3); /* Adjusted border color */
  border-top: 3px solid #5d3be9; /* Main spinner color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

textarea {
  max-height: 200px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Markdown Styling */
.markdown-content {
  font-family: 'Inter', sans-serif;
  word-wrap: break-word;
}

/* Code Block Styling */
.markdown-content pre {
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  background: #1e293b !important;
}

/* Inline Code */
.markdown-content code {
  font-family: monospace;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

/* Copyable Code Blocks */
.markdown-content pre code {
  display: block;
  padding: 0;
  background: #1e293b;
}

/* Table Styling */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.markdown-content th, .markdown-content td {
  border: 1px solid #ddd;
  padding: 8px;
}

.markdown-content th {
  background-color: #5d3be9;
  color: white;
  text-align: left;
}

.code-container {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
}

.copy-btn:hover {
  background: #444;
}

</style>
