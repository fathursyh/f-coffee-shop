import { BaseSchema } from '@adonisjs/lucid/schema'

const paymentStatus = ['UNPAID', 'PAID'] as const
export type PaymentStatus = (typeof paymentStatus)[number]

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.enum('status', paymentStatus).defaultTo('UNPAID').notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.string('payment_link').nullable()
      table.timestamp('paid_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
