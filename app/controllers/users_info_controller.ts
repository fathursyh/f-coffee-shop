import { createUserInfoValidator, updateUserInfoValidator } from '#validators/user_info'
import { type HttpContext } from '@adonisjs/core/http'
import { ToastEnum } from '../enums/toast_enum.js'
import UserInfoPolicy from '#policies/user_info_policy'
import UserInfo from '#models/user_info'

export default class UsersInfoController {
  async create({ inertia, auth, response }: HttpContext) {
    await auth.user?.load('userInfo')
    const isExist = auth.user?.userInfo
    if (isExist) return response.redirect().toPath(`/user_info/${isExist.id}/edit`)
    return inertia.render('user_info/create', { userInfo: null })
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    const userInfo = await UserInfo.findOrFail(params.id)
    await bouncer.with(UserInfoPolicy).authorize('edit', userInfo)
    return inertia.render('user_info/create', { userInfo: userInfo.toJSON() } as any)
  }

  async store({ request, response, auth, session }: HttpContext) {
    const validatedData = await request.validateUsing(createUserInfoValidator)
    try {
      await auth.user!.related('userInfo').create({
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        postCode: validatedData.post_code,
        phone: validatedData.phone,
      })
      session.flash(ToastEnum.SUCCESS, 'Shipping address saved successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Failed to save shipping address. Please try again.')
      return response.redirect().back()
    }
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const userInfo = await UserInfo.findOrFail(params.id)
    await bouncer.with(UserInfoPolicy).authorize('update', userInfo)
    const validatedData = await request.validateUsing(updateUserInfoValidator)

    try {
      userInfo.address = validatedData.address
      userInfo.city = validatedData.city
      userInfo.country = validatedData.country
      userInfo.postCode = validatedData.post_code
      userInfo.phone = validatedData.phone
      await userInfo.save()

      session.flash(ToastEnum.SUCCESS, 'Shipping address updated successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Failed to update shipping address. Please try again.')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const userInfo = await UserInfo.findOrFail(params.id)
    await bouncer.with(UserInfoPolicy).authorize('delete', userInfo)

    try {
      await userInfo.delete()
      session.flash(ToastEnum.SUCCESS, 'Shipping address removed successfully.')
      return response.redirect().toRoute('home')
    } catch (err) {
      session.flash(ToastEnum.ERROR, 'Failed to remove shipping address.')
      return response.redirect().back()
    }
  }
}
