import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import type { Router } from '@adonisjs/core/http'

export default function registerPublicOrderRoutes(router: Router) {
  router
    .group(() => {
      router.get('orders', [controllers.Orders, 'index']).as('orders.index')
      router.get('orders/:id', [controllers.Orders, 'show']).as('orders.show')
      router.post('orders/checkout', [controllers.Orders, 'checkout']).as('orders.checkout')
      router.post('orders/:id/cancel', [controllers.Orders, 'cancel']).as('orders.cancel')
      router.post('payments/:orderId/simulate-pay', [controllers.Payments, 'markAsPaid']).as('payments.simulatePay')
    })
    .use(middleware.auth())
}

