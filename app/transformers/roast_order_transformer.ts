import { BaseTransformer } from '@adonisjs/core/transformers'
import type RoastOrder from '#models/roast_order'
import OrderTransformer from '#transformers/order_transformer'

export default class RoastOrderTransformer extends BaseTransformer<RoastOrder> {
  toObject() {
    const orderItem = this.resource.$preloaded.orderItem ? this.resource.orderItem : null
    const order = orderItem?.$preloaded.order ? orderItem.order : null

    return {
      ...this.pick(this.resource, [
        'id',
        'orderItemId',
        'status',
        'scheduledFor',
        'createdAt',
        'updatedAt',
      ]),

      orderItem: orderItem
        ? {
            id: orderItem.id,
            orderId: orderItem.orderId,
            coffeeId: orderItem.coffeeId,
            coffeeName: orderItem.coffeeName,
            grind: orderItem.grind,
            roastType: orderItem.roastType,
            quantity: orderItem.quantity,
            weight: orderItem.weight,
            unitPrice: orderItem.unitPrice,
            subtotal: orderItem.subtotal,
            order: order ? new OrderTransformer(order).toObject() : undefined,
          }
        : undefined,
    }
  }
}
