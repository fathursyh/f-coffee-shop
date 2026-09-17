import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import type { Router } from '@adonisjs/core/http'

export default function registerPublicOrderRoutes(router: Router) {
  router
    .group(() => {
      router.get('orders', [controllers.Orders, 'index']).as('orders.index')
      router.post('orders/checkout', [controllers.Orders, 'checkout']).as('orders.checkout')
    })
    .use(middleware.auth())
}
