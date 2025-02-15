import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  {
    languageOptions: {
      globals: globals.browser,
      ref: 'readonly',
      computed: 'readonly',
      useColorMode: 'readonly'
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Allow single-word component names
      'no-undef': 'off' // Ignore undefined errors for auto-imported functions
    }
  }
]
