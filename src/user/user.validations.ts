import * as yup from 'yup'

export const PasswordSchema = yup.object({
  password: yup.string().min(6).required(),
})

export const AuthSchema = yup
  .object({
    email: yup.string().email().required(),
  })
  .concat(PasswordSchema)

export const UpdatePasswordSchema = yup
  .object({
    oldPassword: yup.string().min(6).required(),
  })
  .concat(PasswordSchema)
