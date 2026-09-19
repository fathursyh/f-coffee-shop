import { type OrderStatus } from '#database/migrations/1789290844108_create_orders_table'
import Order from '#models/order'
import RoastOrder from '#models/roast_order'
import OrderTransformer from '#transformers/order_transformer'
import RoastOrderTransformer from '#transformers/roast_order_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  dashboard({ inertia }: HttpContext) {
    return inertia.render('admin/dashboard', {})
  }

  async allOrders({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()
    const status = request.input('status', 'ALL')

    const ordersQuery = Order.query().preload('user').preload('items').orderBy('created_at', 'desc')

    if (search) {
      ordersQuery.where((builder) => {
        if (!Number.isNaN(Number(search))) {
          builder.where('id', Number(search))
        }
        builder
          .orWhereILike('shipping_city', `%${search}%`)
          .orWhereILike('shipping_address', `%${search}%`)
          .orWhereHas('user', (userQuery) => {
            userQuery.whereILike('full_name', `%${search}%`).orWhereILike('email', `%${search}%`)
          })
      })
    }

    if (status && status !== 'ALL') {
      ordersQuery.where('status', status as OrderStatus)
    }

    const orders = await ordersQuery.paginate(page, 10)

    return inertia.render('admin/all_orders', {
      orders: OrderTransformer.paginate(orders.all(), orders.getMeta()),
      filters: { search, status },
    })
  }

  async updateStatus({ request, params, response }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    order.status = request.input('status')
    await order.save()

    return response.redirect().back()
  }

  async pendingRoast({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const status = request.input('status', 'ALL')
    const search = request.input('search', '')

    const roastsQuery = RoastOrder.query()
      .preload('orderItem', (orderItemQuery) => {
        orderItemQuery.preload('order', (orderQuery) => {
          orderQuery.preload('user')
        })
      })
      .orderBy('created_at', 'desc')

    if (status && status !== 'ALL') {
      roastsQuery.where('status', status.toLowerCase())
    }

    if (search) {
      roastsQuery.where((q) => {
        q.whereILike('id', `%${search}%`).orWhereHas('orderItem', (itemQuery) => {
          itemQuery.whereILike('coffee_name', `%${search}%`).orWhereHas('order', (orderQuery) => {
            orderQuery.whereILike('id', `%${search}%`).orWhereILike('shipping_city', `%${search}%`)
          })
        })
      })
    }

    const roasts = await roastsQuery.paginate(page, 15)

    return inertia.render('admin/all_roast_orders', {
      roasts: RoastOrderTransformer.paginate(roasts.all(), roasts.getMeta()),
      filters: {
        status,
        search,
      },
    })
  }

  customerData({ inertia }: HttpContext) {
    return inertia.render('admin/customer_data', {})
  }
  coffeeData({ inertia }: HttpContext) {
    return inertia.render('admin/coffee_data', {})
  }
  reports({ inertia }: HttpContext) {
    return inertia.render('admin/reports', {})
  }
}
