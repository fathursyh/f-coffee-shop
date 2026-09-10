import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      session.flash('success', 'You have successfully logged in!')
      response.redirect().toRoute('home')
    } catch (err) {
      session.flash('error', 'Something is wrong!')
      response.redirect().back('/login')
    }
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'You have successfully logged out!')
    response.redirect().toRoute('session.create')
  }
}
