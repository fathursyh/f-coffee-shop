import { createUserInfoValidator } from '#validators/user_info'
import { type HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  create({ inertia }: HttpContext) {
    return inertia.render('user_info/create', {})
  }

  async store({ request, response, auth, session }: HttpContext) {
    const validatedData = await request.validateUsing(createUserInfoValidator)
    try {
      await auth.user!.related('userInfo').create(validatedData)
      session.flash('success', 'User information saved successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash('error', 'Failed to save user information. Please try again.')
      return response.redirect().back()
    }
  }
}
