import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import { ToastEnum } from '../enums/toast_enum.js'

export default class PaymentsController {
  /**
   * Simulates a successful checkout payment (Dev / Rapid prototyping)
   */
  async markAsPaid({ params, auth, response, session, request }: HttpContext) {
    const user = auth.user!

    return await db.transaction(async (trx) => {
      const order = await Order.query({ client: trx })
        .where('id', params.orderId)
        .where('user_id', user.id)
        .preload('payment')
        .firstOrFail()

      if (!order.payment) {
        if (request.header('x-inertia')) {
          session.flash(ToastEnum.ERROR, 'Payment record not found')
          return response.redirect().back()
        }
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

      if (request.header('x-inertia')) {
        session.flash(ToastEnum.SUCCESS, 'Payment confirmed! Order queued for roasting.')
        return response.redirect().back()
      }

      return response.ok({
        message: 'Payment confirmed! Order queued for roasting.',
        orderStatus: order.status,
        paymentStatus: order.payment.status,
        paidAt: order.payment.paidAt,
      })
    })
  }
}
