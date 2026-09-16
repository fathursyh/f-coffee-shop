import { registry } from '@generated/registry'
import { createTuyau } from '@tuyau/core/client'

export const client = createTuyau({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3333',
  registry,
})

export const urlFor = client.urlFor
