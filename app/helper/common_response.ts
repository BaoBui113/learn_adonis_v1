import { HttpContext } from '@adonisjs/core/http'
interface Meta {
  totalItems?: number
  itemsPerPage?: number
  currentPage?: number
  totalPages?: number
}

interface SuccessResponse<T> {
  status: 'success'
  message: string
  data?: T
  meta?: Meta
}

interface ErrorResponse {
  status: 'error'
  message: string
  errors?: any
}

class ResponseCommon {
  static success<T>(response: HttpContext['response'], message: string, data?: T, meta?: Meta) {
    const result: SuccessResponse<T> = { status: 'success', message, data, meta }
    return response.status(200).json(result)
  }

  static created<T>(response: HttpContext['response'], message: string, data?: T) {
    const result: SuccessResponse<T> = { status: 'success', message, data }
    return response.status(201).json(result)
  }

  static error(response: HttpContext['response'], message: string, statusCode = 500, errors?: any) {
    const result: ErrorResponse = { status: 'error', message, errors }
    return response.status(statusCode).json(result)
  }

  static validationError(response: HttpContext['response'], errors: any) {
    return this.error(response, 'Validation failed', 422, errors)
  }

  static unauthorized(response: HttpContext['response'], message = 'Unauthorized') {
    return this.error(response, message, 401)
  }

  static forbidden(response: HttpContext['response'], message = 'Forbidden') {
    return this.error(response, message, 403)
  }

  static notFound(response: HttpContext['response'], message = 'Resource not found') {
    return this.error(response, message, 404)
  }
}

export default ResponseCommon
