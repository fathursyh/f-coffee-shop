import vine from '@vinejs/vine'

export const createCoffeeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    slug: vine.string().trim().toLowerCase().maxLength(120).optional(),
    origin: vine.string().trim().minLength(2).maxLength(100),
    subregion: vine.string().trim().maxLength(100).optional(),
    elevation: vine.string().trim().maxLength(100).optional(),
    process: vine.string().trim().maxLength(100).optional(),
    roast: vine.string().trim().maxLength(50),
    roastLevel: vine.number().min(1).max(5),
    tastingNotes: vine.array(vine.string().trim()).minLength(1),
    description: vine.string().trim().optional(),
    bestFor: vine.string().trim().optional(),
    basePrice250G: vine.number().min(0.01),
    badge: vine.string().trim().optional().nullable(),
    stockQuantity: vine.number().min(0).optional(),
    imageUrl: vine.string().trim().optional().nullable(),
    isActive: vine.boolean().optional(),
  })
)

export const updateCoffeeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    slug: vine.string().trim().toLowerCase().maxLength(120).optional(),
    origin: vine.string().trim().minLength(2).maxLength(100).optional(),
    subregion: vine.string().trim().maxLength(100).optional().nullable(),
    elevation: vine.string().trim().maxLength(100).optional().nullable(),
    process: vine.string().trim().maxLength(100).optional().nullable(),
    roast: vine.string().trim().maxLength(50).optional(),
    roastLevel: vine.number().min(1).max(5).optional(),
    tastingNotes: vine.array(vine.string().trim()).minLength(1).optional(),
    description: vine.string().trim().optional().nullable(),
    bestFor: vine.string().trim().optional().nullable(),
    basePrice250G: vine.number().min(0.01).optional(),
    badge: vine.string().trim().optional().nullable(),
    stockQuantity: vine.number().min(0).optional(),
    imageUrl: vine.string().trim().optional().nullable(),
    isActive: vine.boolean().optional(),
  })
)
