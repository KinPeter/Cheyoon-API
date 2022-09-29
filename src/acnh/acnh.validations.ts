import * as yup from 'yup'
import { ErrorCode } from '../common/error-codes'

export const AcnhInputSchema = yup.object({
  villagers: yup.array(yup.number().notRequired()).required(ErrorCode.FIELD_REQUIRED),
  favorites: yup.array(yup.number().notRequired()).required(ErrorCode.FIELD_REQUIRED),
})

export const VillagerIdInputSchema = yup.object({
  villagerId: yup.number().min(0, ErrorCode.INVALID_VALUE).required(ErrorCode.FIELD_REQUIRED),
})
