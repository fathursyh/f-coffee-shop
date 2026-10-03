import type { HttpContext } from '@adonisjs/core/http'
import Coffee from '#models/coffee'
import Cart from '#models/cart'

export default class CoffeesController {
  /**
   * Display product detail page for a specific coffee bean by slug or ID.
   * GET /coffees/:slug
   */
  async show({ params, inertia, auth, response }: HttpContext) {
    const coffee = await Coffee.query()
      .where('slug', params.slug)
      .orWhere('id', params.slug)
      .first()

    if (!coffee) {
      return response.notFound('Coffee bean not found')
    }

    let dbCart: Cart[] = []
    if (auth.user) {
      dbCart = await Cart.query().where('user_id', auth.user.id).preload('coffee')
    }

    return inertia.render('coffee_detail', {
      coffee: coffee.toJSON(),
      dbCart: dbCart.map((c) => c.toJSON()),
    } as any)
  }
}
