import { roastOrderStatus } from '#database/migrations/1789661407200_create_roast_orders_table'
import vine from '@vinejs/vine'

export const updateRoastOrderStatusValidator = vine.create({
  status: vine.enum(roastOrderStatus),
})
