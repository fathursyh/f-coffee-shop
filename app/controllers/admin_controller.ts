import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  dashboard({ inertia }: HttpContext) {
    return inertia.render('admin/dashboard', {})
  }
}
