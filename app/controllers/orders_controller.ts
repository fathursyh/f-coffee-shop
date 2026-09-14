import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Cart from '#models/cart'
import UserInfo from '#models/user_info'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'

export default class OrdersController {
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
        session.flash('error', 'Cart is empty.')
        return response.redirect().back()
      }

      const userInfo = await UserInfo.query({ client: trx }).where('user_id', user.id).first()

      if (!userInfo) {
        session.flash('error', 'Please complete your user information before checking out.')
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

      session.flash('success', 'Order created successfully. Please proceed to payment.')
      return response.redirect().toRoute('home')
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
