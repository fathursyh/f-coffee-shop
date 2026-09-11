import type { HttpContext } from '@adonisjs/core/http'
import Coffee from '#models/coffee'
import type Cart from '#models/cart'

export default class PublicsController {
  async home({ inertia, auth }: HttpContext) {
    const carts: Cart[] = auth.user
      ? await auth.user.related('cart').query().preload('coffee').orderBy('createdAt', 'asc')
      : []

    const coffee: Coffee[] = await Coffee.all()

    return inertia.render('home', {
      dbCart: carts,
      coffee,
    })
  }
}
