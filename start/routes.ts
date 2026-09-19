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
import { throttle } from './limiter.ts'
import registerAdminOrderRoutes from './routes/admin/orders_routes.ts'
import registerAuthRoutes from './routes/auth_routes.ts'
import registerPublicOrderRoutes from './routes/order_routes.ts'
import registerPublicCartRoutes from './routes/cart_routes.ts'
import registerUserRoutes from './routes/user_routes.ts'

router.get('/', [controllers.Publics, 'home']).as('home')

registerAuthRoutes(router)
registerPublicOrderRoutes(router)
registerPublicCartRoutes(router)
registerUserRoutes(router)

router
  .group(() => {
    router.get('dashboard', [controllers.Admin, 'dashboard']).as('dashboard')
    registerAdminOrderRoutes(router)
    router.get('roast-orders', [controllers.Admin, 'pendingRoast']).as('roast_orders')
    router.get('customers', [controllers.Admin, 'customerData']).as('customers')
    router.get('coffees', [controllers.Admin, 'coffeeData']).as('coffees')
    router.get('reports', [controllers.Admin, 'reports']).as('reports')
  })
  .prefix('admin')
  .as('admin')
  .use(middleware.auth())
  .use(middleware.authorize({ role: 'ADMIN' }))
  .use(throttle)
