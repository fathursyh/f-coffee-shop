import { PaymentSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.ts'
import Order from './order.ts'
import { compose } from '@adonisjs/core/helpers'
import { omitColumns } from '#database/schema_helper'

export default class Payment extends compose(PaymentSchema, omitColumns('totalPrice')) {
  @column({ serialize: (value) => Number(value) })
  declare totalPrice: number

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
