import { OrderItemSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.ts'
import Coffee from './coffee.ts'
import { compose } from '@adonisjs/core/helpers'
import { omitColumns } from '#database/schema_helper'

export default class OrderItem extends compose(
  OrderItemSchema,
  omitColumns('subtotal', 'unitPrice')
) {
  @column()
  declare unitPrice: number
  @column()
  declare subtotal: number

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Coffee)
  declare coffee: BelongsTo<typeof Coffee>
}
