import Coffee from '#models/coffee'
import type { HttpContext } from '@adonisjs/core/http'

export default class PublicsController {
  async home({ inertia }: HttpContext) {
    return inertia.render('home', {
      coffee: inertia.once(async () => await Coffee.all(), {}),
    })
  }
}
