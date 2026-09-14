/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Publics, 'home']).as('home')

router
  .group(() => {
    router.get('register', [controllers.NewAccount, 'create'])
    router.post('register', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.group(() => {
      router.post('carts/sync', [controllers.Carts, 'sync']).as('carts.sync')
      router.resource('carts', controllers.Carts).except(['create', 'edit', 'index'])
      router.delete('carts', [controllers.Carts, 'clear']).as('carts.clear')
    })

    router.group(() => {
      router.get('orders', [controllers.Orders, 'index']).as('orders.index')
      router.post('orders/checkout', [controllers.Orders, 'checkout']).as('orders.checkout')
      router
        .patch('orders/:id/status', [controllers.Orders, 'updateOrderStatus'])
        .as('orders.updateStatus')
    })

    router.resource('user_info', controllers.Users).only(['create', 'store'])
  })
  .use(middleware.auth())
