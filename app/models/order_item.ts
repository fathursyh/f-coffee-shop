import { OrderItemSchema } from '#database/schema'
import { belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Order from './order.ts'
import Coffee from './coffee.ts'
import { compose } from '@adonisjs/core/helpers'
import { omitColumns } from '#database/schema_helper'
import RoastOrder from './roast_order.ts'

export default class OrderItem extends compose(
  OrderItemSchema,
  omitColumns('subtotal', 'unitPrice')
) {
  @column({ serialize: (value) => Number(value) })
  declare unitPrice: number
  @column({ serialize: (value) => Number(value) })
  declare subtotal: number

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Coffee)
  declare coffee: BelongsTo<typeof Coffee>

  @hasOne(() => RoastOrder)
  declare roastOrder: HasOne<typeof RoastOrder>
}
