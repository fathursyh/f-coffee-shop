import { createUserInfoValidator, updateUserInfoValidator } from '#validators/user_info'
import { type HttpContext } from '@adonisjs/core/http'
import { ToastEnum } from '../enums/toast_enum.ts'
import UserInfoPolicy from '#policies/user_info_policy'
import UserInfo from '#models/user_info'

export default class UsersInfoController {
  async create({ inertia, auth, response }: HttpContext) {
    await auth.user?.load('userInfo')
    const isExist = auth.user?.userInfo
    if (isExist) return response.redirect().toRoute('home')
    return inertia.render('user_info/create', {})
  }

  async store({ request, response, auth, session }: HttpContext) {
    const validatedData = await request.validateUsing(createUserInfoValidator)
    try {
      await auth.user!.related('userInfo').create(validatedData)
      session.flash(ToastEnum.SUCCESS, 'User information saved successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Failed to save user information. Please try again.')
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const userInfo = await UserInfo.findOrFail(params.id)

    await bouncer.with(UserInfoPolicy).authorize('update', userInfo)

    const validatedData = await request.validateUsing(updateUserInfoValidator)

    try {
      await userInfo.merge(validatedData).save()
      session.flash(ToastEnum.SUCCESS, 'User information updated successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Failed to update user information. Please try again.')
      return response.redirect().back()
    }
  }
}
