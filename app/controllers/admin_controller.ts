import { type OrderStatus } from '#database/migrations/1789290844108_create_orders_table'
import Order from '#models/order'
import OrderTransformer from '#transformers/order_transformer'
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
  pendingRoast({ inertia }: HttpContext) {
    return inertia.render('admin/pending_roast', {})
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
