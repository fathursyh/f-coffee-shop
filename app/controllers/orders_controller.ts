import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Cart from '#models/cart'
import UserInfo from '#models/user_info'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'
import { updateOrderStatusValidator } from '#validators/update_order_status'
import { ToastEnum } from '../enums/toast_enum.ts'
import { inject } from '@adonisjs/core'
import { OrderService } from '#services/order_service'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const orders: Order[] = await Order.query()
      .where('user_id', user.id)
      .preload('items')
      .preload('payment')
      .orderBy('created_at', 'desc')

    return inertia.render('orders', { orders } as any)
  }

  async checkout({ auth, response, session }: HttpContext) {
    const user = auth.user!

    return await db.transaction(async (trx) => {
      const cartItems = await Cart.query({ client: trx })
        .where('user_id', user.id)
        .preload('coffee')

      if (cartItems.length === 0) {
        session.flash(ToastEnum.ERROR, 'Cart is empty.')
        return response.redirect().back()
      }

      const userInfo = await UserInfo.query({ client: trx }).where('user_id', user.id).first()

      if (!userInfo) {
        session.flash(ToastEnum.ERROR, 'Please complete your user information before checking out.')
        return response.redirect().toRoute('user_info.create')
      }

      const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      const freeShippingThreshold = 45
      const shippingCost = subtotal >= freeShippingThreshold ? 0 : 4.99
      const totalAmount = subtotal + shippingCost

      // 4. Create the Order
      const order = await Order.create(
        {
          userId: user.id,
          subtotal,
          shippingCost,
          totalAmount,
          status: 'PENDING',
          shippingAddress: userInfo.address,
          shippingCity: userInfo.city,
          shippingCountry: userInfo.country,
          shippingPostCode: userInfo.postCode,
          shippingPhone: userInfo.phone,
        },
        { client: trx }
      )

      // 5. Create Order Items (Beans snapshot)
      const orderItemsPayload = cartItems.map((item) => ({
        orderId: order.id,
        coffeeId: item.coffeeId,
        coffeeName: item.coffee.name,
        weight: item.weight,
        grind: item.grind,
        roastType: item.roastType,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      }))

      await OrderItem.createMany(orderItemsPayload, { client: trx })

      // 6. Create UNPAID Payment record
      await Payment.create(
        {
          orderId: order.id,
          userId: user.id,
          status: 'UNPAID',
          totalPrice: totalAmount,
          paymentLink: null,
        },
        { client: trx }
      )

      await Cart.query({ client: trx }).where('user_id', user.id).delete()

      session.flash(ToastEnum.SUCCESS, 'Order created successfully. Please proceed to payment.')
      return response.redirect().toRoute('home')
    })
  }

  /**
   * Quick status updater for testing fulfillment transitions
   */
  async updateOrderStatus({ params, request, response, session, inertia }: HttpContext) {
    const { status } = await request.validateUsing(updateOrderStatusValidator)
    try {
      const order = await Order.query().preload('items').where('id', params.id).firstOrFail()
      if (order.status === 'CANCELLED') {
        session.flash(ToastEnum.ERROR, 'Cancelled orders cannot be updated.')
        return response.redirect().back()
      }
      if (order.status === 'DELIVERED') {
        session.flash(ToastEnum.ERROR, 'Delivered orders cannot be updated.')
        return response.redirect().back()
      }

      await this.orderService.updateStatus(status, order)

      session.flash(ToastEnum.SUCCESS, `Order status updated to ${status}.`)
      return response.redirect().back()
    } catch (err) {
      if (err instanceof Exception) {
        session.flash(ToastEnum.ERROR, err.message)
        return response.redirect().back()
      }
      return inertia.render('errors/server_error', {})
    }
  }
}
