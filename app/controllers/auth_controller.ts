import Admin from '#models/admin'
import User from '#models/user'
import {
  adminLoginValidator,
  adminRegisterValidator,
  loginValidator,
  registerValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    response.status(201).json({ user })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const accessToken = token.value!.release()
    response.status(200).json({ accessToken })
  }

  async adminRegister({ request, response }: HttpContext) {
    const data = await request.validateUsing(adminRegisterValidator)
    const admin = await Admin.create(data)
    response.status(201).json({ admin })
  }

  async adminLogin({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(adminLoginValidator)
    const admin = await Admin.verifyCredentials(email, password)
    const token = await Admin.adminAccessTokens.create(admin)
    const accessToken = token.value!.release()
    response.status(200).json({ accessToken })
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    if (user instanceof User) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    } else if (user instanceof Admin) {
      await Admin.adminAccessTokens.delete(user, user.currentAccessToken.identifier)
    }
    return { messages: 'Logged out successfully' }
  }

  async me({ auth }: HttpContext) {
    const user = auth.user
    console.log('auth.user', user)

    return {
      user: auth.user,
    }
  }
}
