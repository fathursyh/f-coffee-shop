import { BaseSchema } from '@adonisjs/lucid/schema'

export const orderStatus = ['PENDING', 'ROASTING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
export type OrderStatus = (typeof orderStatus)[number]

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .notNullable()

      // Financials
      table.decimal('subtotal', 10, 2).notNullable()
      table.decimal('shipping_cost', 10, 2).notNullable().defaultTo(0)
      table.decimal('total_amount', 10, 2).notNullable()

      // Order status
      table.enum('status', orderStatus).defaultTo('PENDING').notNullable()

      // Shipping Destination Snapshot
      table.string('shipping_address', 255).notNullable()
      table.string('shipping_city', 50).notNullable()
      table.string('shipping_country', 50).notNullable()
      table.string('shipping_post_code', 10).notNullable()
      table.string('shipping_phone', 20).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
