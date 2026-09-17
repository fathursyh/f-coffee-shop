import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import type { Router } from '@adonisjs/core/http'

export default function registerAuthRoutes(router: Router) {
  router
    .group(() => {
      router.get('register', [controllers.NewAccount, 'create'])
      router.post('register', [controllers.NewAccount, 'store'])

      router.get('login', [controllers.Session, 'create'])
      router.post('login', [controllers.Session, 'store'])
    })
    .use(middleware.guest())
    .use(throttle)

  router.post('logout', [controllers.Session, 'destroy']).use(middleware.auth())
}
