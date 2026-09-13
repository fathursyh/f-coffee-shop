import { OrderSchema } from '#database/schema'
import { belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.ts'
import OrderItem from './order_item.ts'
import Payment from './payment.ts'

export default class Order extends OrderSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>
}
