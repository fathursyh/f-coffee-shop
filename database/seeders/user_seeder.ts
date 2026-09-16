import { type UserRole } from '#database/migrations/1761885935168_create_users_table'
import User from '#models/user'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const hashedPassword = await hash.make(env.get('ROOT_PASSWORD'))

    const users = [
      {
        email: env.get('ROOT_EMAIL'),
        password: hashedPassword,
        fullName: 'Admin',
        role: 'ADMIN' as UserRole,
      },
      {
        email: 'tester@gmail.com',
        password: hashedPassword,
        fullName: 'Tester',
        role: 'USER' as UserRole,
      },
    ]
    await User.createManyQuietly(users)
  }
}
