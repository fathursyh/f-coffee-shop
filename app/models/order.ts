import { OrderSchema } from '#database/schema'
import { belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.ts'
import OrderItem from './order_item.ts'
import Payment from './payment.ts'
import { compose } from '@adonisjs/core/helpers'
import { omitColumns } from '#database/schema_helper'
import type { OrderStatus } from '#database/migrations/1789290844108_create_orders_table'

export default class Order extends compose(
  OrderSchema,
  omitColumns('subtotal', 'shippingCost', 'totalAmount')
) {
  @column({ serialize: (value) => Number(value) })
  declare subtotal: number
  @column({ serialize: (value) => Number(value) })
  declare shippingCost: number
  @column({ serialize: (value) => Number(value).toFixed(2) })
  declare totalAmount: number

  @column()
  declare status: OrderStatus

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>
}
