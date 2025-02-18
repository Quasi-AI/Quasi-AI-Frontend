<template>
  <div class="flex flex-col gap-6 px-5 lg:flex-row">
    <!-- Input Section -->
    <div class="flex w-full flex-col items-center gap-4 lg:w-[50%]">
      <div class="flex items-center gap-4">
        <!-- Export Results -->
        <UButton
          v-if="score !== null"
          class="rounded-2xl bg-[#5D3BEA] text-white"
          :disabled="loading"
          variant="blue"
          @click="exportResults"
        >
          Export Results
        </UButton>

        <!-- Score -->
        <div v-if="score !== null" class="text-lg font-bold">
          Your Score: {{ score }} / {{ quizzes.length }}
        </div>
      </div>

      <!-- Text Area -->
      <textarea
        v-model="messageContent"
        class="min-h-[40vh] w-full rounded-2xl bg-white p-5 shadow transition hover:shadow-xl dark:bg-[#111C44] dark:text-white"
        placeholder="Type your content here"
      />

      <!-- File Upload Instructions -->
      <div class="mt-2 text-center text-gray-600 dark:text-gray-300">
        <p>Please ensure your upload is in one of the following formats:</p>
        <p>
          <strong>Accepted File Types: (.pdf *, .docx, .jpeg, .png)</strong>
        </p>
      </div>

      <!-- File Upload Button -->
      <UButton
        class="rounded-full bg-red-200 p-3 dark:bg-gray-700"
        @click="triggerFileInput"
      >
        <font-awesome-icon :icon="['fas', 'upload']" />
      </UButton>
      <input
        id="file-upload"
        type="file"
        @change="handleFileUpload"
        class="hidden"
      />

      <!-- Level Selection -->
      <select
        v-model="selectedLevel"
        class="w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <!-- Number of Questions -->
      <input
        type="number"
        v-model="numQuestions"
        min="1"
        max="20"
        class="w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white"
        placeholder="Number of questions"
      />

      <!-- Timer Input -->
      <input
        type="number"
        v-model="userTimer"
        min="1"
        class="w-full rounded-lg p-2 dark:bg-[#111C44] dark:text-white"
        placeholder="Timer duration (minutes)"
      />

      <!-- Generate Button -->
      <UButton
        class="rounded-2xl bg-[#5D3BEA] text-white"
        :disabled="loading"
        variant="blue"
        @click="generateQuestions"
      >
        {{ loading ? 'Generating...' : 'Generate Quiz' }}
      </UButton>
    </div>

    <!-- Quiz Section -->
    <div class="flex w-full flex-col lg:w-[50%]">
      <h2 class="mb-2 text-lg font-bold">Quiz</h2>
      <div v-if="quizzes.length === 0" class="text-gray-500">
        No quiz generated yet.
      </div>

      <div v-else class="space-y-4">
        <!-- Timer -->
        <div v-if="timer > 0" class="text-lg font-bold">
          Time Remaining: {{ Math.floor(timer / 60) }}:{{
            timer % 60 < 10 ? '0' : ''
          }}{{ timer % 60 }}
        </div>

        <!-- Questions -->
        <div
          v-for="(quiz, index) in quizzes"
          :key="index"
          class="rounded-2xl bg-white p-4 shadow dark:bg-[#111C44] dark:text-white"
        >
          <p class="font-semibold">{{ index + 1 }}. {{ quiz.question }}</p>
          <div class="mt-2 flex flex-col gap-2">
            <label
              v-for="(option, optIndex) in quiz.options"
              :key="optIndex"
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                :name="'question-' + index"
                :value="option"
                v-model="quiz.userAnswer"
                :disabled="score !== null"
              />
              <span :class="getAnswerClass(quiz, option)">
                {{ option }}
              </span>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <UButton
          class="rounded-2xl bg-[#5D3BEA] text-white"
          @click="checkAnswers"
          variant="blue"
          :disabled="score !== null"
        >
          Submit Answers
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
import * as pdfjsLib from 'pdfjs-dist'

// Specify the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

// State
const messageContent = ref('')
const quizzes = ref([])
const selectedLevel = ref('beginner')
const numQuestions = ref(10)
const loading = ref(false)
const score = ref(null)
const userTimer = ref() // Default timer duration in minutes
const timer = ref(0) // Timer in seconds

// Timer Logic
let timerInterval
const startTimer = () => {
  timer.value = userTimer.value * 60 // Convert minutes to seconds
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else {
      clearInterval(timerInterval)
      checkAnswers() // Automatically submit answers when time runs out
    }
  }, 1000)
}

// Generate Quiz Questions using Google Gemini API
const generateQuestions = async () => {
  if (!messageContent.value.trim()) {
    quizzes.value = [
      {
        question: 'Please provide content to generate quiz questions.',
        options: [],
        correctAnswer: ''
      }
    ]
    return
  }

  loading.value = true
  try {
    const response = await fetch(
      useRuntimeConfig().public.GOOGLE_GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Here is some content:\n\n${messageContent.value}\n\nGenerate ${numQuestions.value} ${selectedLevel.value}-level multiple-choice questions with four options each. Indicate the correct answer with an asterisk (*).`
                }
              ]
            }
          ]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('API Data:', data)

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const rawQuestions = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter(q => q.trim())
      quizzes.value = parseQuizData(rawQuestions)
      quizzes.value = shuffleArray(quizzes.value) // Shuffle questions
      quizzes.value.forEach(quiz => {
        quiz.options = shuffleArray(quiz.options) // Shuffle options
      })
      startTimer() // Start timer
    } else {
      quizzes.value = [
        {
          question: 'Failed to generate quiz questions.',
          options: [],
          correctAnswer: ''
        }
      ]
    }
  } catch (error) {
    console.error('Error:', error)
    quizzes.value = [
      {
        question: 'Error generating quiz. Please try again.',
        options: [],
        correctAnswer: ''
      }
    ]
  } finally {
    loading.value = false
  }
}

// Parse generated text into quiz format
const parseQuizData = rawQuestions => {
  const quizList = []
  let currentQuestion = null
  let answerBuffer = null

  rawQuestions.forEach(line => {
    const trimmedLine = line.trim()

    // New question detection
    if (trimmedLine.match(/^\d+\./)) {
      if (currentQuestion) {
        // Add buffered correct answer to options if exists
        if (answerBuffer) {
          currentQuestion.options.push(answerBuffer)
          answerBuffer = null
        }
        quizList.push(currentQuestion)
      }
      currentQuestion = {
        question: trimmedLine.replace(/^\d+\.\s*/, ''),
        options: [],
        correctAnswer: '',
        userAnswer: null
      }
    }
    // Correct answer detection (anywhere in line)
    else if (trimmedLine.includes('*')) {
      answerBuffer = trimmedLine.replace(/\*/g, '').trim()
      currentQuestion.correctAnswer = answerBuffer
    }
    // Regular option
    else if (trimmedLine) {
      currentQuestion.options.push(trimmedLine)
    }
  })

  // Handle the last question
  if (currentQuestion) {
    if (answerBuffer) {
      currentQuestion.options.push(answerBuffer)
    }
    quizList.push(currentQuestion)
  }

  // Verify all questions have 4 options
  return quizList.map(quiz => {
    if (quiz.options.length < 4) {
      return {
        question: `Invalid question format: ${quiz.question}`,
        options: [],
        correctAnswer: ''
      }
    }
    return quiz
  })
}

// Shuffle array
const shuffleArray = array => array.sort(() => Math.random() - 0.5)

// Check user answers
const checkAnswers = () => {
  let correctCount = 0
  quizzes.value.forEach(quiz => {
    if (quiz.userAnswer === quiz.correctAnswer) correctCount++
  })
  score.value = correctCount
  clearInterval(timerInterval) // Stop timer
}

// Highlight correct and incorrect answers
const getAnswerClass = (quiz, option) => {
  if (score.value !== null) {
    const isCorrect = option === quiz.correctAnswer
    const isWrong = option === quiz.userAnswer && !isCorrect
    return {
      'text-green-600 font-bold': isCorrect,
      'text-red-600': isWrong
    }
  }
  return {}
}

// Trigger the hidden file input when the button is clicked
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// Handle the file selection
const handleFileUpload = async event => {
  const file = event.target.files[0]

  if (!file) return

  const fileType = file.type

  // PDF Handling
  if (fileType === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = async e => {
      const pdfData = new Uint8Array(e.target.result)
      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map(item => item.str).join(' ') + '\n'
        }
        messageContent.value = text
      } catch (error) {
        console.error('Error extracting text from PDF:', error)
        messageContent.value =
          'Failed to extract text from PDF. Please try again.'
      }
    }
    reader.readAsArrayBuffer(file)
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    // Handle DOCX files
    const reader = new FileReader()
    reader.onload = e => {
      const arrayBuffer = e.target.result
      mammoth
        .extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => {
          messageContent.value = result.value
        })
        .catch(err => {
          console.error('Error extracting text from DOCX:', err)
        })
    }
    reader.readAsArrayBuffer(file)
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    // Handle PPTX files
    const reader = new FileReader()
    reader.onload = async e => {
      const arrayBuffer = e.target.result
      try {
        const pptx = new PPTX2Json()
        pptx.load(arrayBuffer)
        pptx
          .getSlides()
          .then(slides => {
            let text = ''
            slides.forEach(slide => {
              slide.texts.forEach(textItem => {
                text += textItem.text + ' '
              })
            })
            messageContent.value = text
          })
          .catch(err => {
            console.error('Error extracting slides:', err)
          })
      } catch (err) {
        console.error('Error extracting text from PPTX:', err)
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    console.error('Unsupported file type:', fileType)
  }
}

// Export Results
const exportResults = () => {
  const results = quizzes.value
    .map((quiz, index) => {
      return `Question ${index + 1}: ${quiz.question}\nYour Answer: ${quiz.userAnswer || 'Not answered'}\nCorrect Answer: ${quiz.correctAnswer}\n\n`
    })
    .join('')
  const blob = new Blob([results], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'quiz-results.txt'
  link.click()
}
</script>
