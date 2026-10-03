import type { HttpContext } from '@adonisjs/core/http'
import Coffee from '#models/coffee'
import { createCoffeeValidator, updateCoffeeValidator } from '#validators/coffee'
import string from '@adonisjs/core/helpers/string'
import { ToastEnum } from '../../enums/toast_enum.js'

export default class CoffeesController {
  /**
   * Display a paginated list of all coffees (including inactive).
   * GET /admin/coffees
   */
  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '').trim()
    const status = request.input('status', 'ALL') // 'ALL', 'ACTIVE', 'INACTIVE'

    const query = Coffee.query().orderBy('created_at', 'desc')

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${search}%`)
          .orWhereILike('origin', `%${search}%`)
          .orWhereILike('roast', `%${search}%`)
      })
    }

    if (status === 'ACTIVE') {
      query.where('is_active', true)
    } else if (status === 'INACTIVE') {
      query.where('is_active', false)
    }

    const coffees = await query.paginate(page, 10)

    return inertia.render('admin/coffee_data', {
      coffees: coffees.toJSON(),
      filters: { search, status },
    } as any)
  }

  /**
   * Store a newly created coffee bean in database.
   * POST /admin/coffees
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCoffeeValidator)

    const baseSlug = payload.slug || string.slug(payload.name)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await Coffee.findBy('slug', slug)) {
      slug = `${baseSlug}-${counter++}`
    }

    const id = slug

    await Coffee.create({
      id,
      slug,
      name: payload.name,
      origin: payload.origin,
      subregion: payload.subregion ?? null,
      elevation: payload.elevation ?? null,
      process: payload.process ?? null,
      roast: payload.roast,
      roastLevel: payload.roastLevel,
      tastingNotes: payload.tastingNotes,
      description: payload.description ?? null,
      bestFor: payload.bestFor ?? null,
      basePrice250G: payload.basePrice250G,
      badge: payload.badge ?? null,
      stockQuantity: payload.stockQuantity ?? 50,
      imageUrl: payload.imageUrl ?? null,
      isActive: payload.isActive ?? true,
    })

    session.flash(ToastEnum.SUCCESS, `Coffee "${payload.name}" added successfully.`)
    return response.redirect().back()
  }

  /**
   * Update the specified coffee bean.
   * PUT/PATCH /admin/coffees/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const coffee = await Coffee.findOrFail(params.id)
    const payload = await request.validateUsing(updateCoffeeValidator)

    if (payload.slug && payload.slug !== coffee.slug) {
      const existing = await Coffee.query()
        .where('slug', payload.slug)
        .whereNot('id', coffee.id)
        .first()

      if (existing) {
        session.flash(ToastEnum.ERROR, 'Slug is already in use by another coffee bean.')
        return response.redirect().back()
      }
      coffee.slug = payload.slug
    }

    if (payload.name !== undefined) coffee.name = payload.name
    if (payload.origin !== undefined) coffee.origin = payload.origin
    if (payload.subregion !== undefined) coffee.subregion = payload.subregion
    if (payload.elevation !== undefined) coffee.elevation = payload.elevation
    if (payload.process !== undefined) coffee.process = payload.process
    if (payload.roast !== undefined) coffee.roast = payload.roast
    if (payload.roastLevel !== undefined) coffee.roastLevel = payload.roastLevel
    if (payload.tastingNotes !== undefined) coffee.tastingNotes = payload.tastingNotes
    if (payload.description !== undefined) coffee.description = payload.description
    if (payload.bestFor !== undefined) coffee.bestFor = payload.bestFor
    if (payload.basePrice250G !== undefined) coffee.basePrice250G = payload.basePrice250G
    if (payload.badge !== undefined) coffee.badge = payload.badge
    if (payload.stockQuantity !== undefined) coffee.stockQuantity = payload.stockQuantity
    if (payload.imageUrl !== undefined) coffee.imageUrl = payload.imageUrl
    if (payload.isActive !== undefined) coffee.isActive = payload.isActive

    await coffee.save()

    session.flash(ToastEnum.SUCCESS, `Coffee "${coffee.name}" updated successfully.`)
    return response.redirect().back()
  }

  /**
   * Delete or archive the specified coffee bean.
   * DELETE /admin/coffees/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const coffee = await Coffee.findOrFail(params.id)
    const coffeeName = coffee.name
    await coffee.delete()

    session.flash(ToastEnum.SUCCESS, `Coffee "${coffeeName}" deleted successfully.`)
    return response.redirect().back()
  }
}
