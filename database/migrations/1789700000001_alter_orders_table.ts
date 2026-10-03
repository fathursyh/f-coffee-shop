import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('courier_name', 100).nullable()
      table.string('tracking_number', 100).nullable()
      table.dateTime('roast_date', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('courier_name')
      table.dropColumn('tracking_number')
      table.dropColumn('roast_date')
    })
  }
}
