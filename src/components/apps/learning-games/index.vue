<template>
  <div class="p-6">
    <div class="mb-4 flex gap-4">
      <select v-model="selectedCategory" class="p-2 border rounded">
        <option value="">All Categories</option>
        <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="selectedAge" class="p-2 border rounded">
        <option value="">All Ages</option>
        <option v-for="age in uniqueAges" :key="age" :value="age">{{ age }}</option>
      </select>
      <select v-model="selectedLevel" class="p-2 border rounded">
        <option value="">All Levels</option>
        <option v-for="level in uniqueLevels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="(card, index) in filteredCards"
        :key="index"
        @click="flipCard(index)"
        class="w-64 h-40 bg-blue-500 text-white p-4 rounded-xl flex items-center justify-center text-center cursor-pointer transition-transform transform hover:scale-105"
        :class="{ 'bg-green-500': card.flipped }"
      >
        <span v-if="!card.flipped">{{ card.question }}</span>
        <span v-else>{{ card.answer }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: '',
      selectedAge: '',
      selectedLevel: '',
      cards: [
        { category: 'Geography', age: '10+', level: 'Beginner', question: 'What is the capital of France?', answer: 'Paris', flipped: false },
        { category: 'Mathematics', age: '12+', level: 'Intermediate', question: 'What is 5 + 7?', answer: '12', flipped: false },
        { category: 'Literature', age: '15+', level: 'Advanced', question: 'Who wrote Hamlet?', answer: 'William Shakespeare', flipped: false },
        { category: 'Science', age: '10+', level: 'Beginner', question: 'What is the boiling point of water?', answer: '100°C or 212°F', flipped: false },
        { category: 'History', age: '12+', level: 'Intermediate', question: 'Who was the first president of the USA?', answer: 'George Washington', flipped: false },
        { category: 'Technology', age: '15+', level: 'Advanced', question: 'What does HTML stand for?', answer: 'HyperText Markup Language', flipped: false }
      ]
    };
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.cards.map(card => card.category))];
    },
    uniqueAges() {
      return [...new Set(this.cards.map(card => card.age))];
    },
    uniqueLevels() {
      return [...new Set(this.cards.map(card => card.level))];
    },
    filteredCards() {
      return this.cards.filter(card => 
        (this.selectedCategory === '' || card.category === this.selectedCategory) &&
        (this.selectedAge === '' || card.age === this.selectedAge) &&
        (this.selectedLevel === '' || card.level === this.selectedLevel)
      );
    }
  },
  methods: {
    flipCard(index) {
      this.cards[index].flipped = !this.cards[index].flipped;
      this.speak(this.cards[index].flipped ? this.cards[index].answer : this.cards[index].question);
    },
    speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  }
};
</script>

<style scoped>
.card {
  transition: background-color 0.3s ease-in-out;
}
</style>
