import { BaseSchema } from '@adonisjs/lucid/schema'

export const roastOrderStatus = ['PENDING', 'DONE', 'CANCELLED'] as const
export type RoastOrderStatus = (typeof roastOrderStatus)[number]
export default class extends BaseSchema {
  protected tableName = 'roast_orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('order_item_id')
        .unsigned()
        .references('id')
        .inTable('order_items')
        .onDelete('CASCADE')
        .notNullable()
        .unique()

      table.enum('status', roastOrderStatus).notNullable().defaultTo(roastOrderStatus[0])
      table.timestamp('scheduled_for', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
