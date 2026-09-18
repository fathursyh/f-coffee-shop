import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'
import type { OrderStatus } from '#database/migrations/1789290844108_create_orders_table'
import type Order from '#models/order'
import RoastOrder from '#models/roast_order'

export class OrderService {
  async updateStatus(status: OrderStatus, order: Order): Promise<void> {
    const itemIds = order.items?.map((item) => item.id) ?? []

    await db.transaction(async (trx) => {
      order.useTransaction(trx)

      switch (status) {
        case 'ROASTING': {
          if (itemIds.length > 0) {
            const roasts = itemIds.map((orderItemId) => ({
              orderItemId,
              status: 'pending' as const,
            }))
            await RoastOrder.updateOrCreateMany('orderItemId', roasts, { client: trx })
          }
          break
        }

        case 'SHIPPED': {
          if (itemIds.length > 0) {
            const pendingRoast = await RoastOrder.query({ client: trx })
              .whereIn('orderItemId', itemIds)
              .where('status', 'pending')
              .first()

            if (pendingRoast) {
              throw new Exception('This order still has pending roasts progress.', { status: 400 })
            }
          }
          break
        }

        case 'CANCELLED': {
          if (itemIds.length > 0) {
            await RoastOrder.query({ client: trx }).whereIn('orderItemId', itemIds).delete()
          }
          break
        }

        case 'PENDING':
        case 'DELIVERED':
          break
      }

      order.status = status
      await order.save()
    })
  }
}
