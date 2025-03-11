// Handle drag over event
export const handleDragOver = (event: {
  preventDefault: () => void
  currentTarget: { classList: { add: (arg0: string) => void } }
}) => {
  event.preventDefault()
  event.currentTarget.classList.add('border-blue-500')
}

// Handle drop event
export const handleDrop = async (
  event: {
    preventDefault: () => void
    currentTarget: { classList: { remove: (arg0: string) => void } }
    dataTransfer: { files: any }
  },
  callback: (arg0: { target: HTMLInputElement }) => any
) => {
  event.preventDefault()
  event.currentTarget.classList.remove('border-blue-500')

  const files = event.dataTransfer.files
  if (files.length > 0) {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.files = files // Set the dropped file to the file input

    // Trigger the callback with the file input event
    await callback({ target: fileInput })
  }
}
