import User from '#models/user'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const hashedPassword = await hash.make(env.get('ROOT_PASSWORD'))
    await User.createQuietly({
      email: env.get('ROOT_EMAIL'),
      password: hashedPassword,
      fullName: 'Admin',
      role: 'ADMIN',
    })
  }
}
