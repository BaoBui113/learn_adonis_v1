import Admin from '#models/admin'
import User from '#models/user'
import Skill from '#models/skill'
import {
  adminLoginValidator,
  adminRegisterValidator,
  loginValidator,
  registerValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseCommon from '../helper/common_response.js'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const { skillIds, ...userData } = data

    // Create the user
    const user = await User.create(userData)

    // Attach skills to the user
    if (skillIds && skillIds.length > 0) {
      const skills = await Skill.query().whereIn('id', skillIds)
      await user.related('skills').attach(skills.map((skill) => skill.id))
    }

    await user.load('skills')
    response.status(201).json({ user })
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

  async adminRegister({ request, response }: HttpContext) {
    const data = await request.validateUsing(adminRegisterValidator)
    const admin = await Admin.create(data)
    response.status(201).json({ admin })
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
      return ResponseCommon.success(response, 'User retrieved successfully', auth.user)
    } catch (error) {
      return ResponseCommon.error(response, 'Failed to retrieve user')
    }
  }
}
