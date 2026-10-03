/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'

import registerAuthRoutes from './routes/auth_routes.js'
import registerPublicCartRoutes from './routes/cart_routes.js'
import registerPublicOrderRoutes from './routes/order_routes.js'
import registerUserRoutes from './routes/user_routes.js'
import registerAdminOrderRoutes from './routes/admin/orders_routes.js'

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
router.get('/', [controllers.Publics, 'home']).as('home')
router.get('coffees/:slug', [controllers.Coffees, 'show']).as('coffees.show')

/*
|--------------------------------------------------------------------------
| Modular Application Routes
|--------------------------------------------------------------------------
*/
registerAuthRoutes(router)
registerPublicCartRoutes(router)
registerPublicOrderRoutes(router)
registerUserRoutes(router)

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('dashboard', [controllers.Admin, 'dashboard']).as('dashboard')
    router.get('roast-orders', [controllers.Admin, 'pendingRoast']).as('roast_orders')
    router.get('customers', [controllers.Admin, 'customerData']).as('customers')
    router.get('reports', [controllers.Admin, 'reports']).as('reports')

    // Admin Coffee CRUD
    router.get('coffees', [controllers.admin.Coffees, 'index']).as('coffees')
    router.post('coffees', [controllers.admin.Coffees, 'store']).as('coffees.store')
    router.patch('coffees/:id', [controllers.admin.Coffees, 'update']).as('coffees.update')
    router.put('coffees/:id', [controllers.admin.Coffees, 'update']).as('coffees.put')
    router.delete('coffees/:id', [controllers.admin.Coffees, 'destroy']).as('coffees.destroy')

    // Admin order & roasting sub-routes
    registerAdminOrderRoutes(router)
  })
  .prefix('admin')
  .as('admin')
  .use([
    middleware.auth(),
    middleware.authorize({ role: 'ADMIN' }),
    throttle,
  ])
