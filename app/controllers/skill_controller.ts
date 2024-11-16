// app/controllers/skills_controller.ts
import Skill from '#models/skill'
import type { HttpContext } from '@adonisjs/core/http'

export default class SkillsController {
  public async index({ response }: HttpContext) {
    const skills = await Skill.query().preload('users')
    return response.json(skills)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['name'])
    const skill = await Skill.create(data)
    return response.status(201).json(skill)
  }

  public async show({ params, response }: HttpContext) {
    const skill = await Skill.findOrFail(params.id)
    await skill.load('users')
    return response.json(skill)
  }

  public async update({ params, request, response }: HttpContext) {
    const skill = await Skill.findOrFail(params.id)
    const data = request.only(['name'])
    skill.merge(data)
    await skill.save()
    return response.json(skill)
  }

  public async destroy({ params, response }: HttpContext) {
    const skill = await Skill.findOrFail(params.id)
    await skill.delete()
    return response.status(204).send()
  }
}
