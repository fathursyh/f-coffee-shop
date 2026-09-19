import type Order from '#models/order'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from './user_transformer.ts'

export default class OrderTransformer extends BaseTransformer<Order> {
  toObject() {
    const user = this.resource.$preloaded.user ? this.resource.user : null
    const items = this.resource.$preloaded.items ? this.resource.items : null

    return {
      ...this.pick(this.resource, [
        'id',
        'shippingAddress',
        'shippingCity',
        'shippingCost',
        'shippingCountry',
        'shippingPhone',
        'shippingPostCode',
        'status',
        'subtotal',
        'totalAmount',
        'createdAt',
        'updatedAt',
      ]),
      user: user ? new UserTransformer(user).toObject() : null,
      itemsCount: items ? items.length : 0,
      items: items ?? [],
    }
  }
}
