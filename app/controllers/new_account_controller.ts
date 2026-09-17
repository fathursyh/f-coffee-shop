import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { ToastEnum } from '../enums/toast_enum.ts'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { passwordConfirmation, ...payload } = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })

    await auth.use('web').login(user)
    session.flash(ToastEnum.SUCCESS, 'Your new account has been created!')
    response.redirect().toRoute('home')
  }
}
