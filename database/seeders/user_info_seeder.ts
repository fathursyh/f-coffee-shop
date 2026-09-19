import UserInfo from '#models/user_info'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const user = await db.query().from('users').where('email', 'tester@gmail.com').firstOrFail()
    const USER_INFO = {
      phone: '0818199821',
      address: 'Benhil No.44',
      city: 'Jakarta Pusat',
      postCode: '16352',
      country: 'Indonesia',
      userId: user.id,
    }
    await UserInfo.createQuietly(USER_INFO)
  }
}
