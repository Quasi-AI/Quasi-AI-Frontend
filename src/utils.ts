export const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
  
  export function getErrorMessage(error: any): string {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    return 'An unexpected error occurred'
  }
  
  export function handleError(error: any) {
    console.error('API Error:', error)
    return getErrorMessage(error)
  }
  