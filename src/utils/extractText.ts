import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'

/**
 * Extracts text from a PDF file.
 * @param {File} file - The uploaded PDF file.
 * @returns {Promise<string>} Extracted text.
 */
export const extractTextFromPDF = async file => {
  try {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise
    let fullText = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const text = await page.getTextContent()
      fullText += text.items.map(item => item.str).join(' ') + '\n'
    }

    return fullText
  } catch (error) {
    console.error('PDF Extraction Error:', error)
    return 'Failed to extract text from PDF.'
  }
}

/**
 * Extracts text from a DOCX file.
 * @param {File} file - The uploaded DOCX file.
 * @returns {Promise<string>} Extracted text.
 */
export const extractTextFromDocx = async file => {
  try {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async event => {
        try {
          const arrayBuffer = event.target.result
          const result = await mammoth.extractRawText({ arrayBuffer })
          resolve(result.value)
        } catch (err) {
          reject('Failed to extract text from DOCX file.')
        }
      }
      reader.readAsArrayBuffer(file)
    })
  } catch (error) {
    console.error('DOCX Extraction Error:', error)
    return 'Failed to extract text from DOCX file.'
  }
}

/**
 * Handles file upload and extracts text from supported formats.
 * @param {Event} event - The file input change event.
 * @param {Function} updateContent - A callback function to update extracted text.
 */
export const handleFileUpload = async (event, updateContent) => {
  const file = event.target.files[0]
  if (!file) return

  const fileType = file.type
  let extractedText = ''

  if (fileType === 'application/pdf') {
    extractedText = await extractTextFromPDF(file)
  } else if (
    fileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    extractedText = await extractTextFromDocx(file)
  } else {
    alert('Unsupported file format. Please upload a .pdf or .docx file.')
    return
  }

  updateContent(extractedText)
}
