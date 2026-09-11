import { BaseSchema } from '@adonisjs/lucid/schema'

const roastType = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark']

export type RoastType = (typeof roastType)[number]

export default class extends BaseSchema {
  protected tableName = 'carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .string('coffee_id')
        .references('id')
        .inTable('coffees')
        .onDelete('CASCADE')
        .notNullable()
      table.string('weight', 20).notNullable()
      table.string('grind', 100).notNullable()
      table.integer('quantity').unsigned().notNullable().defaultTo(1)
      table.integer('price').notNullable()
      table.enum('roast_type', roastType).notNullable()

      table.unique(['user_id', 'coffee_id', 'weight', 'grind'])

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
