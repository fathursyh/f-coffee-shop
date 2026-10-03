import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Cart from '#models/cart'
import UserInfo from '#models/user_info'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'
import Coffee from '#models/coffee'
import { updateOrderStatusValidator } from '#validators/update_order_status'
import { ToastEnum } from '../enums/toast_enum.js'
import { inject } from '@adonisjs/core'
import { OrderService } from '#services/order_service'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}

  /**
   * Display all orders for authenticated customer.
   * GET /orders
   */
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const orders = await Order.query()
      .where('user_id', user.id)
      .preload('items')
      .preload('payment')
      .orderBy('created_at', 'desc')

    return inertia.render('orders', { orders } as any)
  }

  /**
   * Display single order invoice / tracking detail.
   * GET /orders/:id
   */
  async show({ params, auth, inertia, response }: HttpContext) {
    const user = auth.user!

    const order = await Order.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('items')
      .preload('payment')
      .first()

    if (!order) {
      return response.notFound('Order not found')
    }

    return inertia.render('order_detail', {
      order: order.toJSON(),
    } as any)
  }

  /**
   * Process customer cart checkout with inventory guard & transaction.
   * POST /orders/checkout
   */
  async checkout({ auth, response, session }: HttpContext) {
    const user = auth.user!

    return await db.transaction(async (trx) => {
      const cartItems = await Cart.query({ client: trx })
        .where('user_id', user.id)
        .preload('coffee')

      if (cartItems.length === 0) {
        session.flash(ToastEnum.ERROR, 'Your cart is empty.')
        return response.redirect().back()
      }

      const userInfo = await UserInfo.query({ client: trx }).where('user_id', user.id).first()

      if (!userInfo) {
        session.flash(ToastEnum.ERROR, 'Please complete your shipping address before checking out.')
        return response.redirect().toRoute('user_info.create')
      }

      // 1. Inventory Check: ensure all coffees have sufficient stock
      for (const item of cartItems) {
        const coffee = item.coffee
        if (!coffee || coffee.stockQuantity < item.quantity) {
          const available = coffee ? coffee.stockQuantity : 0
          session.flash(
            ToastEnum.ERROR,
            `Sorry, "${item.coffee?.name || 'Selected coffee'}" only has ${available} bag(s) in stock. Please adjust your bag quantity.`
          )
          return response.redirect().back()
        }
      }

      // 2. Decrement inventory
      for (const item of cartItems) {
        const coffee = item.coffee
        coffee.useTransaction(trx)
        coffee.stockQuantity = Math.max(0, coffee.stockQuantity - item.quantity)
        await coffee.save()
      }

      // 3. Compute financials
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

      // 7. Clear cart
      await Cart.query({ client: trx }).where('user_id', user.id).delete()

      session.flash(ToastEnum.SUCCESS, 'Order placed successfully! Please review and complete payment.')
      return response.redirect().toPath(`/orders/${order.id}`)
    })
  }

  /**
   * Customer cancels a PENDING order and restores inventory stock.
   * POST /orders/:id/cancel
   */
  async cancel({ params, auth, response, session }: HttpContext) {
    const user = auth.user!

    return await db.transaction(async (trx) => {
      const order = await Order.query({ client: trx })
        .where('id', params.id)
        .where('user_id', user.id)
        .preload('items')
        .first()

      if (!order) {
        session.flash(ToastEnum.ERROR, 'Order not found.')
        return response.redirect().back()
      }

      if (order.status !== 'PENDING') {
        session.flash(ToastEnum.ERROR, 'Only pending orders awaiting roasting can be cancelled.')
        return response.redirect().back()
      }

      // Restore inventory
      for (const item of order.items) {
        if (item.coffeeId) {
          const coffee = await Coffee.find(item.coffeeId, { client: trx })
          if (coffee) {
            coffee.useTransaction(trx)
            coffee.stockQuantity += item.quantity
            await coffee.save()
          }
        }
      }

      order.useTransaction(trx)
      order.status = 'CANCELLED'
      await order.save()

      session.flash(ToastEnum.SUCCESS, `Order #${order.id} has been cancelled and stock returned.`)
      return response.redirect().back()
    })
  }

  /**
   * Admin order status and fulfillment updater
   * PATCH /admin/orders/:id/status
   */
  async updateOrderStatus({ params, request, response, session, inertia }: HttpContext) {
    const { status, courierName, trackingNumber } = await request.validateUsing(updateOrderStatusValidator)

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

      if (status === 'ROASTING' && !order.roastDate) {
        order.roastDate = DateTime.now()
      }

      if (status === 'SHIPPED') {
        if (courierName) order.courierName = courierName
        if (trackingNumber) order.trackingNumber = trackingNumber
      }

      await this.orderService.updateStatus(status, order)
      await order.save()

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
