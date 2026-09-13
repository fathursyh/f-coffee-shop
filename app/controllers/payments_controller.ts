import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'

export default class PaymentsController {
  /**
   * Simulates a successful checkout payment (Dev / Rapid prototyping)
   */
  async markAsPaid({ params, auth, response }: HttpContext) {
    const user = auth.user!

    return await db.transaction(async (trx) => {
      const order = await Order.query({ client: trx })
        .where('id', params.orderId)
        .where('user_id', user.id)
        .preload('payment')
        .firstOrFail()

      if (!order.payment) {
        return response.notFound({ message: 'Payment record not found' })
      }

      // 1. Mark payment as PAID
      order.payment.useTransaction(trx)
      order.payment.status = 'PAID'
      order.payment.paidAt = DateTime.now()
      await order.payment.save()

      // 2. Advance order status down the happy path
      order.useTransaction(trx)
      order.status = 'ROASTING'
      await order.save()

      return response.ok({
        message: 'Payment confirmed! Order queued for roasting.',
        orderStatus: order.status,
        paymentStatus: order.payment.status,
        paidAt: order.payment.paidAt,
      })
    })
  }

  /**
   * Quick status updater for testing fulfillment transitions
   */
  async updateOrderStatus({ params, request, response }: HttpContext) {
    const { status } = request.only(['status']) // 'PENDING' | 'ROASTING' | 'SHIPPED' | 'DELIVERED'

    const order = await Order.findOrFail(params.orderId)
    order.status = status
    await order.save()

    return response.ok({
      message: `Order status updated to ${status}`,
      order,
    })
  }
}
