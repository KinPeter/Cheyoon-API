import * as yup from 'yup'
import { ErrorCode } from '../common/error-codes'

export const IngredientSchema = yup.object({
  amount: yup.number().min(0, ErrorCode.INVALID_VALUE).required(ErrorCode.FIELD_REQUIRED),
  unit: yup.string().required(ErrorCode.FIELD_REQUIRED),
  material: yup.string().required(ErrorCode.FIELD_REQUIRED),
})

export const RecipeInputSchema = yup.object({
  public: yup.boolean().required(ErrorCode.FIELD_REQUIRED),
  name: yup.string().required(ErrorCode.FIELD_REQUIRED),
  photoUrl: yup.string().url(ErrorCode.INVALID_FORMAT).required(ErrorCode.FIELD_REQUIRED),
  instructions: yup.string().required(ErrorCode.FIELD_REQUIRED),
  tags: yup
    .array(yup.string().required(ErrorCode.FIELD_REQUIRED))
    .required(ErrorCode.FIELD_REQUIRED),
  servings: yup.number().min(1, ErrorCode.INVALID_VALUE).required(ErrorCode.FIELD_REQUIRED),
  cookingTime: yup.string().required(ErrorCode.FIELD_REQUIRED),
  ingredients: yup
    .array(IngredientSchema)
    .min(1, ErrorCode.CANT_BE_EMPTY)
    .required(ErrorCode.FIELD_REQUIRED),
})
