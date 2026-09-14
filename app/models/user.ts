import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { UserRole } from '#database/migrations/1761885935168_create_users_table'
import Cart from './cart.ts'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import UserInfo from './user_info.ts'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @column()
  declare role: UserRole

  @hasMany(() => Cart)
  declare cart: HasMany<typeof Cart>

  @hasOne(() => UserInfo)
  declare userInfo: HasOne<typeof UserInfo>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
