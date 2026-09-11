import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
  /**
   * Sync items from sessionStorage to the database after login
   */
  async sync({ request, auth, response }: HttpContext) {
    const user = auth.use('web').user!
    const { items = [] } = request.all()

    for (const item of items) {
      if (!item.coffeeId || !item.weight || !item.grind) continue

      const existing = await Cart.query()
        .where('userId', user.id)
        .where('coffeeId', item.coffeeId)
        .where('weight', item.weight)
        .where('grind', item.grind)
        .first()

      if (existing) {
        existing.quantity += Number(item.quantity) || 1
        await existing.save()
      } else {
        await Cart.create({
          userId: user.id,
          coffeeId: item.coffeeId,
          weight: item.weight,
          grind: item.grind,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          roastType: item.roast || 'Medium',
        })
      }
    }

    return response.redirect().back()
  }

  /**
   * Add a single item to the user's cart in the DB
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.use('web').user!
    const { coffeeId, weight, grind, quantity = 1, price, roast } = request.all()

    const existing = await Cart.query()
      .where('userId', user.id)
      .where('coffeeId', coffeeId)
      .where('weight', weight)
      .where('grind', grind)
      .first()

    if (existing) {
      existing.quantity += Number(quantity)
      await existing.save()
    } else {
      await Cart.create({
        userId: user.id,
        coffeeId,
        weight,
        grind,
        quantity: Number(quantity),
        price: Number(price),
        roastType: roast || 'Medium',
      })
    }

    return response.redirect().back()
  }

  /**
   * Update quantity of a cart item (+1 or -1)
   */
  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.use('web').user!
    const { delta } = request.all()

    const cartItem = await Cart.query().where('userId', user.id).where('id', params.id).first()

    if (cartItem) {
      const nextQuantity = cartItem.quantity + Number(delta)
      if (nextQuantity > 0) {
        cartItem.quantity = nextQuantity
        await cartItem.save()
      } else {
        await cartItem.delete()
      }
    }

    return response.redirect().back()
  }

  /**
   * Remove a single cart item
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.use('web').user!

    await Cart.query().where('userId', user.id).where('id', params.id).delete()

    return response.redirect().back()
  }

  /**
   * Clear all items in user's cart (order placed/confirmed)
   */
  async clear({ auth, response }: HttpContext) {
    const user = auth.use('web').user!

    await Cart.query().where('userId', user.id).delete()

    return response.redirect().back()
  }
}
