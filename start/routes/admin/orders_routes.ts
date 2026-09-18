import { controllers } from '#generated/controllers'
import type { Router } from '@adonisjs/core/http'

export default function registerAdminOrderRoutes(router: Router) {
  router.get('orders', [controllers.Admin, 'allOrders']).as('orders')
  router
    .patch('orders/:id/status', [controllers.Orders, 'updateOrderStatus'])
    .as('orders.updateStatus')

  router.resource('orders.roast', controllers.RoastOrders).only(['index', 'update'])
}
