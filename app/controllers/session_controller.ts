import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ToastEnum } from '../enums/toast_enum.ts'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      session.flash(ToastEnum.SUCCESS, 'You have successfully logged in!')
      response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Something is wrong!')
      console.log(err)
      response.redirect().back('/login')
    }
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash(ToastEnum.SUCCESS, 'You have successfully logged out!')
    response.redirect().toRoute('home')
  }
}
