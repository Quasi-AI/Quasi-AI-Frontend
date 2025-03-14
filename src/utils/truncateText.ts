export const truncateText = (text: string, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const truncateTextLong = (text: string, length = 500) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
