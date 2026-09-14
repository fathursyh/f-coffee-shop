import vine from '@vinejs/vine'

export const createUserInfoValidator = vine.create(
  vine.object({
    address: vine.string().trim().minLength(3).maxLength(255),

    city: vine.string().trim().minLength(2).maxLength(50),

    country: vine.string().trim().minLength(2).maxLength(50),

    post_code: vine
      .string()
      .trim()
      .maxLength(6)
      .regex(/^[a-zA-Z0-9\s-]+$/),

    phone: vine
      .string()
      .trim()
      .maxLength(15)
      .regex(/^[0-9+\s()-]+$/),
  })
)
