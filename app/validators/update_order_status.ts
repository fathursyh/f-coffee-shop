import { orderStatus } from '#database/migrations/1789290844108_create_orders_table'
import vine from '@vinejs/vine'

export const updateOrderStatusValidator = vine.create({
  status: vine.enum(orderStatus),
  courierName: vine.string().trim().maxLength(100).optional().nullable(),
  trackingNumber: vine.string().trim().maxLength(100).optional().nullable(),
})
