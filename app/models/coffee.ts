import { CoffeeSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { column } from '@adonisjs/lucid/orm'
import { omitColumns } from '#database/schema_helper'

export default class Coffee extends compose(
  CoffeeSchema,
  omitColumns('basePrice250G', 'roastLevel')
) {
  @column({
    columnName: 'base_price_250g',
    consume: (value: string | null) => (value !== null ? Number(value) : 0),
  })
  declare basePrice250G: number

  @column({
    columnName: 'roast_level',
    consume: (value: string | null) => (value !== null ? Number(value) : 0),
  })
  declare roastLevel: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string | string[]) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare tastingNotes: string[]
}
