export const STATUS_CODES: Record<string, number> = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

export function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return String(error.response.data.message)
  }
  return 'An unexpected error occurred. Please try again later.'
}

export function handleError(error: unknown): string {
  console.error('API Error:', error)
  return getErrorMessage(error)
}
