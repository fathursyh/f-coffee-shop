import { type UserRole } from '#database/migrations/1761885935168_create_users_table'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type AuthorizationOptions = { permissions: string[] } | { role: UserRole }

export default class AuthorizeRequestMiddleware {
  /**
   * The third parameter 'options' contains the authorization requirements
   * specified when applying this middleware to a route.
   */
  async handle(
    { auth, response, session }: HttpContext,
    next: NextFn,
    options: AuthorizationOptions
  ) {
    /**
     * Get the authenticated user or throw an exception
     */
    const user = auth.getUserOrFail()

    /**
     * Check if the user has the required role
     */
    if ('role' in options && user.role !== options.role) {
      session.flash('error', 'You are not authorized to access this page.')
      return response.redirect().toRoute('home', {})
    }

    /**
     * Check if the user has all required permissions
     */
    // if ('permissions' in options) {
    //   const hasPermission = options.permissions.every((permission) =>
    //     user.permissions.includes(permission)
    //   )

    //   if (!hasPermission) {
    //     return response.unauthorized('Not authorized to access this route')
    //   }
    // }

    /**
     * User is authorized, continue to the next middleware or handler
     */
    await next()
  }
}
