import * as yup from 'yup'
import { ErrorCode } from '../common/error-codes'

export const PasswordSchema = yup.object({
  password: yup.string().min(6, ErrorCode.INVALID_FORMAT).required(ErrorCode.FIELD_REQUIRED),
})

export const AuthSchema = yup
  .object({
    email: yup.string().email(ErrorCode.INVALID_FORMAT).required(ErrorCode.FIELD_REQUIRED),
  })
  .concat(PasswordSchema)

export const UpdatePasswordSchema = yup
  .object({
    oldPassword: yup.string().min(6, ErrorCode.INVALID_FORMAT).required(ErrorCode.FIELD_REQUIRED),
  })
  .concat(PasswordSchema)
