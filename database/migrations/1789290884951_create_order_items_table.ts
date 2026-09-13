import { BaseSchema } from '@adonisjs/lucid/schema'

const roastType = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'] as const

export default class extends BaseSchema {
  protected tableName = 'order_items'

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
      table.string('coffee_id').references('id').inTable('coffees').onDelete('SET NULL').nullable()

      table.string('coffee_name').notNullable()
      table.string('weight', 20).notNullable()
      table.string('grind', 100).notNullable()
      table.enum('roast_type', roastType).notNullable()
      table.integer('quantity').unsigned().notNullable()
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('subtotal', 10, 2).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
