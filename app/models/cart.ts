import type { RoastType } from '#database/migrations/1789048820298_create_carts_table'
import { CartSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Coffee from '#models/coffee'

export default class Cart extends CartSchema {
  @column()
  declare roastType: RoastType

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Coffee, {
    foreignKey: 'coffeeId',
  })
  declare coffee: BelongsTo<typeof Coffee>
}
