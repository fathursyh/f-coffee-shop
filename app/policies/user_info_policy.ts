import type User from '#models/user'
import type UserInfo from '#models/user_info'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserInfoPolicy extends BasePolicy {
  edit(user: User, userInfo: UserInfo): AuthorizerResponse {
    return user.id === userInfo.userId
  }

  update(user: User, userInfo: UserInfo): AuthorizerResponse {
    return user.id === userInfo.userId
  }
}
