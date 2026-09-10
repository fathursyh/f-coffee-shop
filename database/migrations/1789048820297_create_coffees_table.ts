// database/migrations/1710000000000_create_coffees_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coffees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable()
      table.string('origin').notNullable()
      table.string('subregion').nullable()
      table.string('elevation').nullable()
      table.string('process').nullable()
      table.string('roast').notNullable()
      table.decimal('roast_level', 3, 1).notNullable()
      table.json('tasting_notes').notNullable()
      table.text('description').nullable()
      table.string('best_for').nullable()
      table.decimal('base_price_250g', 8, 2).notNullable()
      table.string('badge').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
