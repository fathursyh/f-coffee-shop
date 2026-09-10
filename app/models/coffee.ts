// app/models/coffee.ts
import { CoffeeSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'
import { ModelAttributes } from '@adonisjs/lucid/types/model'

export default class Coffee extends CoffeeSchema {
  @column({ columnName: 'base_price_250g' })
  declare basePrice250G: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string | string[]) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare tastingNotes: string[]
}

export type CoffeeAttributes = ModelAttributes<Coffee>
