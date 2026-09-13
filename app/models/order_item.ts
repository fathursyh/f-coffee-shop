import { OrderItemSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.ts'
import Coffee from './coffee.ts'

export default class OrderItem extends OrderItemSchema {
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Coffee)
  declare coffee: BelongsTo<typeof Coffee>
}
