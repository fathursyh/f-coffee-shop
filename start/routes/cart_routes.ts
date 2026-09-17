import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import type { Router } from '@adonisjs/core/http'

export default function registerPublicCartRoutes(router: Router) {
  router
    .group(() => {
      router.post('carts/sync', [controllers.Carts, 'sync']).as('carts.sync')
      router.resource('carts', controllers.Carts).only(['store', 'update', 'destroy'])
      router.delete('carts', [controllers.Carts, 'clear']).as('carts.clear')
    })
    .use(middleware.auth())
}
