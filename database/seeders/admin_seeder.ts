import Admin from '#models/admin'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    const existingAdmin = await Admin.query().where('email', 'admin@gmail.com').first()
    if (!existingAdmin) {
      const admin = await Admin.create({
        email: 'admin@gmail.com',
        password: '123456',
      })
      await Admin.adminAccessTokens.create(admin)
    }
  }
}
