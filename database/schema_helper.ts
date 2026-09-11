import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'

type CleanInstance<T extends LucidModel, Keys extends keyof any> = Omit<
  InstanceType<T>,
  Keys | 'toAttributes'
> & {
  [K in Keys]?: any
} & {
  toAttributes(): any
} & LucidRow

type CleanConstructor<T extends LucidModel, Keys extends keyof any> = {
  new (...args: any[]): CleanInstance<T, Keys>
  prototype: CleanInstance<T, Keys>
} & Omit<T, 'prototype'> &
  LucidModel

export function omitColumns<Keys extends keyof any>(..._keys: Keys[]) {
  return <T extends LucidModel>(superclass: T) => {
    return superclass as unknown as CleanConstructor<T, Keys>
  }
}
