// database/migrations/xxxx_create_user_skills_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUserSkillsTable extends BaseSchema {
  protected tableName = 'user_skills'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('skill_id').unsigned().references('id').inTable('skills').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
