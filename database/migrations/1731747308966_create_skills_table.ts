// database/migrations/xxxx_create_skills_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateSkillsTable extends BaseSchema {
  protected tableName = 'skills'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
