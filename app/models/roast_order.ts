import type { RoastOrderStatus } from '#database/migrations/1789661407200_create_roast_orders_table'
import { RoastOrderSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import OrderItem from './order_item.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class RoastOrder extends RoastOrderSchema {
  @column()
  declare status: RoastOrderStatus

  @belongsTo(() => OrderItem)
  declare orderItem: BelongsTo<typeof OrderItem>
}
