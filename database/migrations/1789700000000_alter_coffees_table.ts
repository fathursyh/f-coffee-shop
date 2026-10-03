import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coffees'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').nullable().unique().index()
      table.integer('stock_quantity').notNullable().defaultTo(50)
      table.string('image_url').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
    })

    // Populate existing coffees slug with id if null
    this.defer(async (db) => {
      await db.rawQuery('UPDATE coffees SET slug = id WHERE slug IS NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
      table.dropColumn('stock_quantity')
      table.dropColumn('image_url')
      table.dropColumn('is_active')
    })
  }
}
