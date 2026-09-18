import type { HttpContext } from '@adonisjs/core/http'
import RoastOrder from '#models/roast_order'
import Order from '#models/order'
import OrderTransformer from '#transformers/order_transformer'
import RoastOrderTransformer from '#transformers/roast_order_transformer'

export default class RoastOrdersController {
  /**
   * Display a paginated list of roast orders with relational search and filtering
   */
  async index({ request, inertia, params }: HttpContext) {
    const page = request.input('page', 1)
    const status = request.input('status', 'ALL')
    const orderId = params.order_id

    console.log(orderId)

    const roastsQuery = RoastOrder.query()
      .preload('orderItem', (itemQuery) => {
        itemQuery.preload('order', (orderQuery) => {
          orderQuery.preload('user')
        })
      })
      .orderBy('created_at', 'desc')

    if (orderId) {
      roastsQuery.whereHas('orderItem', (itemQuery) => {
        itemQuery.where('order_id', orderId)
      })
    }

    // Status filter
    if (status && status !== 'ALL') {
      roastsQuery.where('status', status.toLowerCase())
    }

    const [roasts, scopedOrder] = await Promise.all([
      roastsQuery.paginate(page, 10),
      Order.query().preload('user').where('id', orderId).firstOrFail(),
    ])

    return inertia.render('admin/order_roasts', {
      order: OrderTransformer.transform(scopedOrder),
      roasts: RoastOrderTransformer.paginate(roasts.all(), roasts.getMeta()),
      currentFilter: status,
    })
  }

  /**
   * Update the status of a specific roast batch
   */
  async update({ params, request, response }: HttpContext) {
    const { status } = request.only(['status'])

    const roast = await RoastOrder.findOrFail(params.id)
    roast.status = status
    await roast.save()

    return response.redirect().back()
  }
}
