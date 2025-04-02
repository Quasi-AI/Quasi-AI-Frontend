export function generateString(length: number = 10): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  const array: Uint8Array = new Uint8Array(length)

  crypto.getRandomValues(array)

  return Array.from(array, byte => characters[byte % charactersLength]).join('')
}
