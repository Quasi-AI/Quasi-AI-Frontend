export const truncateText = (text: string, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
