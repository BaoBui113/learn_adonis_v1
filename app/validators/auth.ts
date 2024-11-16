import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().optional(),
    skillIds: vine.array(vine.number()).optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').select('id').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

export const adminLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

export const adminRegisterValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const admin = await db.from('admins').select('id').where('email', value).first()
        return !admin
      }),
    password: vine.string().minLength(6),
  })
)
