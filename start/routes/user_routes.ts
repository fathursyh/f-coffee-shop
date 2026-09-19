import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import type { Router } from '@adonisjs/core/http'

export default function registerUserRoutes(router: Router) {
  router
    .group(() => {
      router.resource('user_info', controllers.UsersInfo).only(['create', 'store'])
    })
    .use(middleware.auth())
}
