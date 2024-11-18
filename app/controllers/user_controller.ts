// app/controllers/user_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseCommon from '../helper/common_response.js'

export default class UserController {
  public async index({ response }: HttpContext) {
    try {
      const users = await User.all()
      return ResponseCommon.success(response, 'Users retrieved successfully', users)
    } catch (error) {
      return ResponseCommon.error(response, 'Failed to retrieve users', error.messages)
    }
  }
  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return ResponseCommon.success(response, 'User retrieved successfully', user)
    } catch (error) {
      return ResponseCommon.notFound(response, 'User not found')
    }
  }
}
