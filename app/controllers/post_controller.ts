import Admin from '#models/admin'
import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostController {
  public async index({ response }: HttpContext) {
    const posts = await Post.query().preload('admin')
    return response.json(posts)
  }
  async create({ request, response, auth }: HttpContext) {
    const admin = auth.user! as Admin
    const data = request.only(['title', 'content'])
    const post = await admin.related('posts').create(data)
    return response.status(201).json(post)
  }

  public async show({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.load('admin')
    return response.json(post)
  }

  public async update({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const data = request.only(['title', 'content'])
    post.merge(data)
    await post.save()
    return response.json(post)
  }

  public async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.status(204).json({ message: 'Post deleted' })
  }
}
