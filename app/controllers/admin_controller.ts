import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  dashboard({ inertia }: HttpContext) {
    return inertia.render('admin/dashboard', {})
  }

  allOrders({ inertia }: HttpContext) {
    return inertia.render('admin/all_orders', {})
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
