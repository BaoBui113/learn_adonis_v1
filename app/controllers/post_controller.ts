import Admin from '#models/admin'
import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseCommon from '../helper/common_response.js'
import { createPostValidator } from '#validators/post'
export default class PostController {
  public async index({ response }: HttpContext) {
    const posts = await Post.query().preload('admin')
    return ResponseCommon.success(response, 'Posts retrieved successfully', posts)
  }
  async create({ request, response, auth }: HttpContext) {
    try {
      const admin = auth.user! as Admin
      const postData = await request.validateUsing(createPostValidator)
      const post = await admin.related('posts').create(postData)
      return ResponseCommon.created(response, 'Post created successfully', post)
    } catch (error) {
      if (error.messages) {
        return ResponseCommon.validationError(response, error.messages)
      }
      return ResponseCommon.error(response, 'Failed to create post', error.messages)
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      await post.load('admin')
      return ResponseCommon.success(response, 'Post retrieved successfully', post)
    } catch (error) {
      return ResponseCommon.notFound(response, 'Post not found')
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      const data = request.only(['title', 'content'])
      post.merge(data)
      await post.save()
      return ResponseCommon.success(response, 'Post updated successfully', post)
    } catch (error) {
      if (error.messages) {
        return ResponseCommon.validationError(response, error.messages)
      }
      return ResponseCommon.notFound(response, 'Post not found')
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      await post.delete()
      return ResponseCommon.success(response, 'Post deleted successfully')
    } catch (error) {
      return ResponseCommon.notFound(response, 'Post not found')
    }
  }
}
