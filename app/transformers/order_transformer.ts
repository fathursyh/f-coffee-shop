import type Order from '#models/order'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from './user_transformer.ts'

export default class OrderTransformer extends BaseTransformer<Order> {
  toObject() {
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
      user: this.resource.user ? UserTransformer.transform(this.resource.user) : null,
      itemsCount: this.resource.items ? this.resource.items.length : 0,
      items: this.resource.items ?? [],
    }
  }
}
