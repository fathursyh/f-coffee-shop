import { BaseTransformer } from '@adonisjs/core/transformers'
import type RoastOrder from '#models/roast_order'

export default class RoastOrderTransformer extends BaseTransformer<RoastOrder> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'orderItemId',
        'status',
        'scheduledFor',
        'createdAt',
        'updatedAt',
      ]),

      orderItem: this.resource.$preloaded.orderItem
        ? {
            id: this.resource.orderItem.id,
            orderId: this.resource.orderItem.orderId,
            coffeeId: this.resource.orderItem.coffeeId,
            coffeeName: this.resource.orderItem.coffeeName,
            grind: this.resource.orderItem.grind,
            roastType: this.resource.orderItem.roastType,
            quantity: this.resource.orderItem.quantity,
            weight: this.resource.orderItem.weight,
            unitPrice: this.resource.orderItem.unitPrice,
            subtotal: this.resource.orderItem.subtotal,
          }
        : undefined,
    }
  }
}
