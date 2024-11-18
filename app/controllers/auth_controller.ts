import Admin from '#models/admin'
import User from '#models/user'
import { adminLoginValidator, loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseCommon from '../helper/common_response.js'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)
      return ResponseCommon.success(response, 'User registered successfully', user)
    } catch (error) {
      if (error.messages) {
        return ResponseCommon.validationError(response, error.messages)
      }
      return ResponseCommon.error(response, 'Failed to register user')
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      const accessToken = {
        accessToken: token.value!.release(),
      }
      return ResponseCommon.success(response, 'User logged in successfully', accessToken)
    } catch (error) {
      return ResponseCommon.error(response, 'Failed to login')
    }
  }

  async adminLogin({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(adminLoginValidator)
      const admin = await Admin.verifyCredentials(email, password)
      const token = await Admin.adminAccessTokens.create(admin)
      const accessToken = {
        accessToken: token.value!.release(),
      }
      return ResponseCommon.success(response, 'Admin logged in successfully', accessToken)
    } catch (error) {
      return ResponseCommon.error(response, 'Failed to login')
    }
  }

  async logout({ response, auth }: HttpContext) {
    const user = auth.user!
    if (user instanceof User) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    } else if (user instanceof Admin) {
      await Admin.adminAccessTokens.delete(user, user.currentAccessToken.identifier)
    }
    return ResponseCommon.success(response, 'User logged out successfully')
  }

  async me({ response, auth }: HttpContext) {
    try {
      return ResponseCommon.success(response, 'Admin retrieved successfully', auth.user)
    } catch (error) {
      return ResponseCommon.error(response, 'Failed to retrieve user')
    }
  }
}
