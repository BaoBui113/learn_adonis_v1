// app/controllers/user_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  public async index({ response }: HttpContext) {
    const users = await User.query().preload('skills')
    return response.json(users)
  }
  public async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('skills')
    return response.json(user)
  }
}
